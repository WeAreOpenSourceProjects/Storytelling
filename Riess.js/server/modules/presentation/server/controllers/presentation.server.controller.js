'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  http = require('http'),
  fs = require('fs'),
  Presentation = mongoose.model('Presentation'),
  Slide = mongoose.model('Slide'),
  Box = mongoose.model('Box'),
  User = mongoose.model('User'),
  Image = mongoose.model('Image'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  ObjectId = mongoose.Schema.ObjectId,
  Promise = require('promise'),
  _ = require('lodash');

exports.create = function(req, res) {
  var presentation = new Presentation(req.body);
  presentation.author = req.user.id;
  Presentation
  .create(presentation)
  .then(function(presentation) {
    return presentation.populate('author').execPopulate()
  })
  .then(function(presentation) {
    return res.json(presentation);
  })
  .catch(function(err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
exports.copy = async function(req, res) {
  const presentationId = req.body.presentationId;
  const user = req.user;

  var presentation = await Presentation.findOne({ _id: presentationId }).exec();
  var newPresentation = _.cloneDeep(presentation.toObject())
  newPresentation.author = req.user.id;
  delete newPresentation._id;
  delete newPresentation.updatedAt;
  delete newPresentation.createdAt;
  newPresentation.title += ' copy';
  newPresentation = await Presentation.create(newPresentation);

  var slides = await Slide.find({_id: { $in: presentation.slideIds } }).exec()
  var newSlides = slides.map(slide => {
    var slide = _.cloneDeep(slide.toObject());
    delete slide._id;
    delete slide.updatedAt;
    delete slide.createdAt;
    slide.presentationId = newPresentation._id;
    return slide;
  })

  if (newSlides.length) {
    newSlides = (await Slide.collection.insert(newSlides)).ops;
  }


  newPresentation.slideIds = newSlides.map(slide => slide._id)

  newSlides = newSlides.map(async function(slide) {
    var boxes = await Box.find({_id: { $in: slide.boxIds } }).exec();
    var newBoxes = boxes.map(box => {
      var box = _.cloneDeep(box.toObject());
      delete box._id;
      delete box.updatedAt;
      delete box.createdAt;
      box.slideId = slide._id;
      return box;
    });
    if (newBoxes.length) {
      boxes = (await Box.collection.insert(newBoxes)).ops;
      slide.boxIds = boxes.map(box => box._id);
    }
    return slide;
  });

  newPresentation = await Presentation.findByIdAndUpdate(newPresentation._id, newPresentation, { new: true }).populate('author');
  (await Promise.all(newSlides)).forEach(async function(slide) { await Slide.findByIdAndUpdate(slide._id, slide, { new: true }) })

  return res.json(newPresentation.toObject());
}

exports.update = function(req, res, next) {
  const user = req.user;
  const presentationId = req.params.presentationId;
  const update = req.body;

  //transfer image object to id string
  //if (presentation.presentation.slideImage && presentation.presentation.slideImage._id) presentation.presentation.slideImage = presentation.presentation.slideImage._id;
  Presentation.findOneAndUpdate({ _id: presentationId, author: user.id }, update, { new: true })
  .exec()
  .then(function(presentation) {
    res.json(presentation);
  })
  .catch(function(err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
    })
  })
};

exports.updateWithShare = function(req, res, next) {
  const user = req.user;
  const presentationId = req.params.presentationId;
  const usersQ = req.body.users;
  var query =[];

  for(var us in usersQ){
    query.push(User.find({ email: usersQ[us].toLowerCase()}));
  };
  query.push(Presentation
    .findOne({ _id: presentationId, author: user.id }));

  Promise.all(query)
  .then(function(result){
    result = _.flatten(result, true);
    var usersR = _.initial(result);
    var presentation = _.last(result);
    for(var userR in usersR){
      if(usersR[userR]._id !== user._id)
        presentation.users.push(usersR[userR]._id)
    }
    presentation.users = _.uniqWith(presentation.users, _.isEqual);
    presentation.save(function(err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
          res.json(presentation);
      }
    });
  })   
};


exports.delete = function(req, res) {
  const user = req.user;
  Presentation
  .findOne({ _id: req.params.presentationId, author: user.id })
  .populate({
    path: 'slideIds',
    populate: [{
      path : 'boxIds',
      populate : {
        path : 'content.imageId',
        model: 'Image'
      }
    }, {
      path : 'background.image',
      model :'Image'
    }]
  })
  .exec()
  .then(function(presentation) {
    var slides = [].concat.apply([], presentation.slideIds);
    var slideIds = slides.map(function(slide) { return slide._id })
    var backgroundIds = [].concat.apply([], slides.map(function(slide) { if (slide.background.image) return slide.background.image._id; } ));
    var boxes = [].concat.apply([], slides.map(function(slide) { return slide.boxIds} ));
    var boxIds = boxes.map(function(box) { return box._id })
    var images = [].concat.apply([], boxes.map(function(box) { return box.content.imageId || ''} ));
    if(images.length>0)
      var imageIds = images.map(function(image) { return image._id })

    return Promise.all([
      Promise.resolve({
        presentationId: presentation.id,
        slideIds: slideIds,
        boxIds: boxIds,
        imageIds : imageIds,
        backgroundIds : backgroundIds
      }),
      presentation.remove(),
      Slide.remove({ _id: { $in: slideIds } }),
      Box.remove({ _id: { $in: boxIds } }),
      Image.remove({ _id: { $in: imageIds } }),
      Image.remove({ _id: { $in: backgroundIds } })
    ])
  })
  .then(function(result) {
    res.json(result[0]);
  })
  .catch(function(err) {
    console.log(err)
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

exports.findOneById = function(req, res) {
  const presentationId = req.params.presentationId
  if (!mongoose.Types.ObjectId.isValid(presentationId)) {
    return res.status(400).send({
      message: 'presentation is invalid'
    });
  }
  Presentation
  .findOne({ _id: presentationId })
  .populate({
    path: 'slideIds',
      populate: [{
        path : 'boxIds',
        populate : {
          path : 'content.imageId',
          model: 'Image'
        }
      }, {
        path : 'background.image',
        model :'Image'
      }]
    })
    .populate({
      path: 'author'
    })
    .exec()
    .then(function(presentation) {
      if (!presentation) {
        return res.status(404).send({
          message: 'No presentation with that identifier has been found'
        });
      }
      return res.json(presentation);
    })
    .catch(function(err) {
      return res.status(422).send({
        message: err
      });
    });
  };

exports.search = function(req, res) {
  var pageIndex = parseInt(req.query.pageIndex ,10);
  var pageSize = parseInt(req.query.pageSize ,10);
  var regexS = new RegExp(req.query.title);

  var request = {
    $and: [{ $or: [] }]   
  }

  if ('title' in req.query) {
    request.$and.push({
      $or: [{
        'title': regexS
      }, {
        'tags': regexS
      }]
    })
  }

  if ('userId' in req.query) {
    var us = mongoose.Types.ObjectId(req.query.userId);
    request.$and[0].$or.push({
      'users' : { $in : [us]}
    })

    request.$and[0].$or.push({
      'author': req.query.userId
    });
    
  }

  if ('isPublic' in req.query) {
    if (req.query.isPublic === 'true') {
      request.$and.push({
        'isPublic': true
      });
    }

    if (req.query.isPublic === 'false') {
      request.$and.push({
        'isPublic': false
      });
    }
  }
  

/*
  if ('isFavorite' in req.query) {
    globalRequest.$and.push({
      'isFavorite': req.query.isFavorite
    })
  }
*/
  var order = (req.query.order === 'date')
  ? '-createdAt'
  : { 'title': 1 };

  if (request.$and[0].$or.length === 0) {
    delete request.$and[0].$or;
  }

  if (request.$and.length === 0) {
    delete request.$and;
  }

  var presentationsCount = Presentation.find(request).count();
  var presentationsFind = Presentation.find(request);
  Promise.all([
    presentationsCount,
    presentationsFind.populate({
      path: 'slideIds'
    })
    .populate({
      path: 'author'
    })
    .skip(pageIndex > 0 ? (pageIndex * pageSize) : 0)
    .limit(pageSize)
    .sort(order)
    .exec()
  ])
  .then(function([count, presentations]) {
    var slides = [].concat.apply([], presentations.map(function(presentation) { return presentation.slideIds }));
    var boxes = [].concat.apply([], slides.map(function(slide) { return slide.boxIds} ));
    res.json({
      presentations: presentations.map(function(presentation) {
        presentation.slideIds = presentation.slideIds.map(function(slide) {
          return slide._id
        })
        return presentation;
      }),
      count
    });
  })
  .catch(function(err) {
    console.log(err)
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

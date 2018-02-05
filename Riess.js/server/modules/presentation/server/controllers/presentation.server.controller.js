'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  http = require('http'),
  fs = require('fs'),
  Presentation = mongoose.model('Presentation'),
  Slide = mongoose.model('Slide'),
  Box = mongoose.model('Box'),
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
/*
exports.copy = function(req, res) {
  const presentationId = req.body.presentationId;
  const user = req.user;

  var presentation = Presentation.findOne({ _id: presentationId });

  var newPresentation = presentation
  .then(function(presentation) {
    var presentation = presentation.toObject();
    delete presentation._id;
    delete presentation.slideIds;
    presentation.author = user.id;
    presentation.title += ' copy';
    return Presentation.create(presentation);
  })
  .then(function(presentation) {
    return presentation.populate('author').execPopulate()
  })

  var slides = presentation
  .then(function(presentation) {
    return Slide.find({_id: { $in: presentation.slideIds } }).exec()
  })



  slides
  .then(function(slides) {
    slides.map(function(slide) {
      const newSlide = _.deepCopy(slide)
      return (copy(newSlide), boxIds)
    })
    return
  });

  var newSlides = slides
  .then(function(slides) {
    if (slides.length === 0) {
      return { ops: [] };
    }
    return Slide.collection.insert(slides.map(function(slide) {
      var slide = slide.toObject();
      delete slide._id;
      return slide;
    }))
  })
  .then(function(slides) {
    return slides.ops;
  })

  var newBoxes = slides
  .then(function(slides) {
    return Box.aggregate(
      { $match: { _id: { $in: [].concat.apply([], slides.map(slide => slide.boxIds)) } } }//,
//      { $group: { _id: '$slideId' } }
    )
//    return Box.find({_id: { $in: [].concat.apply([], slides.map(slide => slide.boxIds)) } }, {$group: 'slideId'}).exec()
  })
  .then(function(boxes) {
    if (boxes.length === 0) {
      return { ops: [] };
    }
    return Box.collection.insert(boxes.map(function(box) {
      console.log('box', box)
//      var box = box.toObject();
      delete box._id;
      delete box.slideId;
      return box;
    }))
  })
  .then(function(boxes) {
    return boxes.ops;
  })

  return Promise.all([newPresentation, newSlides, newBoxes])
  .then(function(result) {

    const presentation = result[0];
    const slides = result[1];
    const boxes = result[2];

    presentation.slideIds = slides.map(function(slide) { return slide._id });
    slides.forEach(function(slide) { slide.presentationId = presentation._id; return slide });
    boxes

    return res.json({
      presentation: result[0]
    })
  })
  .catch(function(err) {
    console.log(err)
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
}
*/

exports.copy = async function(req, res) {
  const presentationId = req.body.presentationId;
  const user = req.user;
  console.log(req.user)

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


//console.log({ ...presentation, ...req.presentation })
/*
  presentation.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(presentation);
    }
  });*/
};

exports.delete = function(req, res) {
  const user = req.user;
  Presentation
  .findOne({ _id: req.params.presentationId, author: user.id })
  .populate({
    path: 'slideIds',
    populate: { path: 'boxIds' }
  })
  .exec()
  .then(function(presentation) {
    var slides = [].concat.apply([], presentation.slideIds);
    var slideIds = slides.map(function(slide) { return slide._id })
    var boxes = [].concat.apply([], slides.map(function(slide) { return slide.boxIds} ));
    var boxIds = boxes.map(function(box) { return box._id })
    return Promise.all([
      Promise.resolve({
        presentationId: presentation.id,
        slideIds: slideIds,
        boxIds: boxIds
      }),
      presentation.remove(),
      Slide.remove({ _id: { $in: slideIds } }),
      Box.remove({ _id: { $in: boxIds } })
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
    populate: { path: 'boxIds' }
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
    $and: []
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

  if ('isPublic' in req.query) {
    request.$and.push({
      'isPublic': req.query.isPublic
    })
  }

  if ('isFavorite' in req.query) {
    request.$and.push({
      'isFavorite': req.query.isFavorite
    })
  }

  var order = (req.query.order === 'date')
  ? '-createdAt'
  : { 'title': 1 };

  if (request.$and.length === 0) {
    delete request.$and;
  }

  Presentation
  .find(request)
  .populate({
    path: 'slideIds',
    populate: { path: 'boxIds' }
  })
  .populate({
    path: 'author'
  })
  .skip(pageIndex > 0 ? (pageIndex * pageSize) : 0)
  .limit(pageSize)
  .sort(order)
  .exec()
  .then(function(presentations) {
    var slides = [].concat.apply([], presentations.map(function(presentation) { return presentation.slideIds }));
    var boxes = [].concat.apply([], slides.map(function(slide) { return slide.boxIds} ));
    res.json({
      presentations: presentations.map(function(presentation) {
        presentation.slideIds = presentation.slideIds.map(function(slide) {
          return slide._id
        })
        return presentation
      }),
      slides: slides,
      boxes: boxes
    });
  })
  .catch(function(err) {
    console.log(err)
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

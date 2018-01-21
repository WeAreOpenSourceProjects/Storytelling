'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  http = require('http'),
  fs = require('fs'),
  Presentation = mongoose.model('Presentation'),
  Slide = mongoose.model('Slide'),
  Box = mongoose.model('Box'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  ObjectId = mongoose.Schema.ObjectId,
  Promise = require('promise');

/**
 * Create an presentation
 */
exports.create = function(req, res) {
  var presentation = new Presentation(req.body);
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

exports.copy = function(req, res) {
  var presentation = Presentation.findOne({ _id: req.body.presentationId })
  var newPresentation = presentation
  .then(function(presentation) {
    var presentation = presentation.toObject();
    delete presentation._id;
    const user = { ...req.user, _id: req.user.id };
    delete user.id;
    presentation.author = user;
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
    return Box.find({_id: { $in: [].concat.apply([], slides.map(slide => slide.boxIds)) } }).exec()
  })
  .then(function(boxes) {
    if (boxes.length === 0) {
      return { ops: [] };
    }
    return Box.collection.insert(boxes.map(function(box) {
      var box = box.toObject();
      delete box._id;
      return box;
    }))
  })
  .then(function(boxes) {
    return boxes.ops;
  })

  return Promise.all([newPresentation, newSlides, newBoxes])
  .then(function(result) {
    return res.json({
      presentation: result[0],
      slides: result[1],
      boxes: result[2]
    })
  })
  .catch(function(err) {
    console.log(err)
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
}

/**
 * Show the current presentation
 */
exports.read = function(req, res) {
  var presentation = req.presentation ? req.presentation.toJSON() : {};
  presentation.isCurrentUserOwner = !!(req.user && presentation.user && presentation.user._id.toString() === req.user._id.toString());
  res.json(presentation);
};

/**
 * Update an presentation
 */
exports.update = function(req, res, next) {
  console.log(req.body)
  //transfer image object to id string
  //if (presentation.presentation.slideImage && presentation.presentation.slideImage._id) presentation.presentation.slideImage = presentation.presentation.slideImage._id;
  Presentation.findByIdAndUpdate(req.params.presentationId, req.body)
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

/**
 * Delete an presentation
 */
exports.delete = function(req, res) {
  Presentation
  .findOne({ _id: req.params.presentationId })
  .populate({
    path: 'slideIds',
    populate: { path: 'boxIds' }
  })
  .exec()
  .then(function(presentation) {
    var slides = [].concat.apply([], presentation.slideIds);
    console.log(presentation)
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

/**
 * List of presentation
 */
exports.list = function(req, res) {
  Presentation.find()
  .sort('-created')
  .populate('user', 'displayName')
  .exec()
  .then(function(presentation) {
    return res.json(presentation);
  })
  .catch(function(err, presentation) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of private presentation
 */
exports.myList = function(req, res) {
  Presentation.find({
      $or: [{
        'author.username': req.query.username
      }, {
        'public': true
      }]
    }).sort('-created').exec(function(err, presentation) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(presentation);
      }
    });
};

/**
 * presentation middleware
 */
exports.findOneById = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'presentation is invalid'
    });
  }

  Presentation.findOneById(id)
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

/**
 * search with filter
 */
exports.search = function(req, res) {
  var pageIndex = parseInt(req.query.pageIndex ,10);
  var pageSize = parseInt(req.query.pageSize ,10);
  var regexS = new RegExp(req.query.title);

//  console.log(mongoose.connection.db.collection('Box'))

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
      presentations: presentations,
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

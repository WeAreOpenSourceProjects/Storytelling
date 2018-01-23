'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  http = require('http'),
  fs = require('fs'),
  Slide = mongoose.model('Slide'),
  Presentation = mongoose.model('Presentation'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  ObjectId = mongoose.Schema.ObjectId,
  Promise = require('promise');

exports.create = function (req, res) {
  const slideP = Slide.create(req.body)
  const presentationP = Presentation.findOne({ _id: req.body.presentationId });

  Promise.all([slideP, presentationP])
  .then(function(result) {
    const slide = result[0];
    const presentation = result[1];
    presentation.slideIds.push(slide._id)
    return Presentation.findByIdAndUpdate(presentation.id, presentation);
  })
  .then(function(presentation) {
    console.log(presentation)
    return slideP;
  })
  .then(function(slide) {
    return res.json(slide);
  })
  .catch(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      })
    }
  });
/*
  .then(function(slide) {
    return res.json(slide)
  })
*/
};
/**
 * Show the current slide
 */
exports.read = function(req, res) {
  var slide = req.slide ? req.slide.toJSON() : {};
  slide.isCurrentUserOwner = !!(req.user && slide.user && slide.user._id.toString() === req.user._id.toString());
  res.json(slide);
};

/**
 * Update the current slide
 */
exports.update = function(req, res, next) {
  //transfer image object to id string
  //if (presentation.presentation.slideImage && presentation.presentation.slideImage._id) presentation.presentation.slideImage = presentation.presentation.slideImage._id;

  Slide.findByIdAndUpdate(req.params.slideId, req.body)
  .exec()
  .then(function(slide) {
    res.json(slide);
  })
  .catch(function(err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
    })
  })
}

/**
 * Delete a slide
 */
exports.delete = function(req, res) {
  const slideP = Slide.findByIdAndRemove(req.params.slideId).exec();
  slideP
  .then(function(slide) {
    return Presentation.findOne({ _id: slide.presentationId })
  })
  .then(function(presentation) {
    presentation.slideIds = presentation.slideIds.filter(function(slideId) { return slideId !== req.params.slideId }).slice();
    return Presentation.findByIdAndUpdate(presentation._id, presentation)
  })
  .then(function(presentation) {
    console.log(4)
    return slideP
  })
  .then(function(slide) {
    console.log(8)
    return res.json(slide);
  })
  .catch(function(err) {
    return res.status(422).send({
    message: errorHandler.getErrorMessage(err)
    })
  });
};

/**
 * List of slides
 */
exports.list = function(req, res) {
  Slide.find().sort('-created').populate('user', 'displayName').exec(function(err, slides) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(slides);
    }
  });
};

/**
 * slide middleware
 */
exports.slideByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'slide is invalid'
    });
  }
  console.log('oui');

  Slide.findById(id).populate({
    path: 'boxIds'
  }).exec(function(err, slide) {
    if (err) {
      return next(err);
    } else if (!slide) {
      return res.status(404).send({
        message: 'No slide with that identifier has been found'
      });
    }
    req.slide = slide;
    next();
  });
};

'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  Slides = mongoose.model('Slides'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an slide
 */
exports.create = function(req, res) {
  console.log("created!!!!");
  console.log(req.body);
  var slide = new Slides(req.body);
  console.log("slide created");


  slide.user = req.user;

  slide.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(slide);
    }
  });
};

/**
 * Show the current slide
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var slide = req.slide ? req.slide.toJSON() : {};
  // Add a custom field to the slide, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the slide model.
  slide.isCurrentUserOwner = !!(req.user && slide.user && slide.user._id.toString() === req.user._id.toString());

  res.json(slide);
};

/**
 * Update an slide
 */
exports.update = function(req, res) {
  var slides = req.slide;
  slides.slidesSetting=req.body.slidesSetting;
  slides.slides=req.body.slides;
  slides.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(slides);
      console.log("finish update");
    }
  });
};

/**
 * Delete an slide
 */
exports.delete = function(req, res) {
  var slide = req.slide;

  slide.remove(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(slide);
    }
  });
};

/**
 * List of slides
 */
exports.list = function(req, res) {
  Slides.find().sort('-created').populate('user', 'displayName').exec(function(err, slides) {
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

  Slides.findById(id).populate('user', 'displayName').exec(function(err, slide) {
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
exports.search = function (req, res) {
  var regexS = new RegExp("^" + req.params.toSearch);
  Slides.find({title: regexS}).exec(function (err, slides) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(slides);
    }
  });
};

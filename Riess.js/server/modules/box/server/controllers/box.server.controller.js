'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  http = require('http'),
  fs = require('fs'),
  Box = mongoose.model('Box'),
  Slide = mongoose.model('Slide'),

  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  ObjectId = mongoose.Schema.ObjectId,
  Promise = require('promise');

  exports.list = function(req, res) {
    Box.find()
    .sort('-created')
    .exec()
    .then(function(boxes) {
      return res.json(boxes);
    })
    .catch(function(err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
  };

/**
 * Create an box
 */
exports.create = function(req, res) {
  console.log(req.body);
  const boxP = Box.create(req.body)
  const slideP = Slide.findOne({ _id: req.body.slideId });

  Promise.all([boxP, slideP])
  .then(function(result) {
    const box = result[0];
    const slide = result[1];
    slide.boxIds.push(box._id)
    return Slide.findByIdAndUpdate(req.body.slideId, slide);
  })
  .then(function(slide) {
    return boxP;
  })
  .then(function(box) {
    return res.json(box);
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


exports.update = function(req, res) {
  console.log(req.params, req.body);
  Box.findByIdAndUpdate(req.params.boxId, req.body)
  .exec()
  .then(function(box) {
    return res.json(box);
  })
  .catch(function(err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete a box
 */
exports.delete = function(req, res) {
  Box.findByIdAndRemove(req.params.boxId)
  .exec()
  .then(function(box) {
    return res.json(box);
  })
  .catch(function(err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

exports.findOneById = function(id) {
  Box.findById(id)
  .exec()
  .then(function(box) {
    if (!box) {
      return res.status(404).send({
        message: 'No box with that identifier has been found'
      });
    }
    req.box = box;
    next();
  })
  .catch(function(err) {
    return next(err);
  });
}

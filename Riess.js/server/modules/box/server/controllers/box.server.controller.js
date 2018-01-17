'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  http = require('http'),
  fs = require('fs'),
  Box = mongoose.model('Box'),
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
  Box.create(req.body)
  .then(function(box) {
      res.json(box);
  })
  .catch(function(err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

exports.update = function(req, res) {
  Box.findOneAndUpdate(req.params.boxId, req.body)
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

exports.boxByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Box is invalid'
    });
  }

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
};

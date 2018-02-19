'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  http = require('http'),
  multer  =   require('multer'),
  fs = require('fs'),
  Box = mongoose.model('Box'),
  Image = mongoose.model('Image'),

  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  ObjectId = mongoose.Schema.ObjectId,
  Promise = require('promise');
  var storage =   multer.diskStorage({
    filename: function (req, file, callback) {
      var ext = path.extname(file.originalname);
      callback(null, file.fieldname + '-' + Date.now());
    }
  });
  var upload = multer({ storage : storage}).single('file');

/**
 * Create an image
 */
exports.create = function(req, res) {
  upload(req,res,function(err) {
    console.log(req.file)
      if(err) {
          return res.end("Error uploading file.");
      }
      var image = new Image;
      image.data = fs.readFileSync(req.file.path);
      image.contentType = req.file.mimetype;
      image.save(function (err, a) {
        console.log(image.data.$binary)
        res.json(image);
      });
  });
};

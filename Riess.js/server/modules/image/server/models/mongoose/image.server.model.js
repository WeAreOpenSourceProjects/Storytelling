'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Box Schema
 */
var ImageSchema = new Schema({
  data: {
    type : Buffer
  },
  contentType: {
    type :String
  }
});
mongoose.model('Image', ImageSchema);

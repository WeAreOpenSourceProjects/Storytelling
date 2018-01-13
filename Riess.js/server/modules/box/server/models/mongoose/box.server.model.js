'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Box Schema
 */
var BoxSchema = new Schema({
  slideId: {
    type: Schema.ObjectId,
    ref: 'Slide'
  },
  grid: {
    cols: {
      type: Number,
      default: '10'
    },
    rows: {
      type: Number,
      default: '10'
    },
    y: {
      type: Number,
      default: 50
    },
    x: {
      type: Number,
      default: 60
    }
  },
  mime: {
    type: String
  },
  content: {
    type: Object
  }
}, {
  timestamps: true
});
mongoose.model('Box', BoxSchema);

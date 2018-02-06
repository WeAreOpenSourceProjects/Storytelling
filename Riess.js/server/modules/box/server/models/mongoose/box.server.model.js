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
  width: {
    type: Number,
    default: '100'
  },
  height: {
    type: Number,
    default: '10'
  },
  cols: {
    type: Number,
    default: '10'
  },
  rows: {
    type: Number,
    default: '10'
  },
  minItemRows: {
    type: Number,
    default: '10'
  },
  minItemCols: {
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
  },
  mime: {
    type: String
  },
  content: {
    type: Object,
    chart : {
      type :Object
    },
    text: {
      type : String
    }
  }
}, {
  timestamps: true
});
mongoose.model('Box', BoxSchema);

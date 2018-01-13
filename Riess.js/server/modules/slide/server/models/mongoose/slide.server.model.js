'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Slide Schema
 */
var SlideSchema = new Schema({
  index: {
    type: Number,
    default: 1
  },
  boxeIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Box',
    required: false
  }],
  presentationId: {
    type: Schema.Types.ObjectId,
    ref: 'Presentation',
    required: false
  }
}, {
  timestamps: true
});
mongoose.model('Slide', SlideSchema);

SlideSchema.post('remove', function (slide) {
  Boxes.remove(slide.boxes)
  next();
});

'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Slides = mongoose.Slides,
  Schema = mongoose.Schema;

/**
 * Presentation Schema
 */
var PresentationSchema = new Schema({
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  tags: {
    type: [String],
    default: [],
    trim: true
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  users: {
    type: [{
      type: Schema.ObjectId,
      ref: 'User'
    }],
    default: []
  },
  banner: {
    type: String,
    defalut: '',
    trim: true
  },
  slideIds: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Slide'
    }]
  }
}, {
  timestamps: true
});
mongoose.model('Presentation', PresentationSchema);

PresentationSchema.post('remove', function(presentation) {
  Slides.remove(presentation.slides);
});

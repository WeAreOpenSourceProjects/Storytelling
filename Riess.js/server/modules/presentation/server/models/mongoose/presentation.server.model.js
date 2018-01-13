'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
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
  public: {
    type: Boolean,
    default: false,
    trim: true
  },
  favorite: {
    type: Boolean,
    default: false,
    trim: true
  },
  description: {
    type: String,
    defalut: '',
    trim: true
  },
  tags: {
    type: [String],
    defalut: '',
    trim: true
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  banner: {
    type: Schema.ObjectId,
    ref: 'Image',
    required: false
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
  Slides.remove(presentation.slides)
});

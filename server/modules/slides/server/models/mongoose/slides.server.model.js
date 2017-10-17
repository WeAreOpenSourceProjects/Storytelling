'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Slides Schema
 */
var SlidesSchema = new Schema({
  slidesSetting: {
    type: {
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
        type: String,
        default: '',
        trim: true
      },
      banner: {
        type: Schema.ObjectId,
        ref: 'Image'
      }
    }
  },

  slides: {
    type: [{
      index: {
        type: Number,
        default: '1',
        trim: true
      },
      boxes: {
        type: [{
          config: {
            type: Object
          },
          text: {
            type: Object
          },
          chart: {
            type: Object
          },
          width: {
            type: Number,
            default: '10'
          },
          height: {
            type: Number,
            default: '10'
          },
          top: {
            type: Number,
            default: 50
          },
          left: {
            type: Number,
            default: 60
          }
        }]
      },
      isValid: {
        type: Boolean,
        default: false,
        trim: true
      }
    }],
    default: '',
    trim: true
  }
}, {
  timestamps: true
});
mongoose.model('Slides', SlidesSchema);

'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SlideSchema = new Schema({
  index: {
    type: Number,
    default: 0
  },
  background : {
    type: Object,
    image : {
      type: Schema.Types.ObjectId,
      ref: 'Image',
    },
    color : {
      type : String
    },
    default: {
      image : null,
      color : 'rgba(255,255,255,0)'
    }
  },
  boxIds: [{
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

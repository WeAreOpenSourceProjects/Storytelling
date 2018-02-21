'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  http = require('http'),
  fs = require('fs'),
  Slide = mongoose.model('Slide'),
  Box = mongoose.model('Box'),
  Image = mongoose.model('Image'),
  Presentation = mongoose.model('Presentation'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  ObjectId = mongoose.Schema.ObjectId,
  Promise = require('promise');

exports.create = function (req, res) {
  const slideP = Slide.create(req.body)
  const presentationP = Presentation.findOne({ _id: req.body.presentationId });

  Promise.all([slideP, presentationP])
  .then(function(result) {
    const slide = result[0];
    const presentation = result[1];
    slide.index = presentation.slideIds.length + 1;
    presentation.slideIds.push(slide._id);
    return Promise.all([Slide.findByIdAndUpdate(slide._id, slide, { new: true }), Presentation.findByIdAndUpdate(presentation.id, presentation)]);
  })
  .then(function(result) {
    return res.json(result[0]);
  })
  .catch(function(err) {
    console.log(err)
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    })
  });
};

exports.bulkUpdate = function(req, res, next) {
  const documents = req.body
  const bulkOps = documents.map(function(document) {
    return {
      updateMany: {
        "filter": { _id: document.id },
        "update" : { $set: { index: document.changes.index }}
     }
    }
  })

  Slide.bulkWrite(bulkOps)
  .then(function(updates) {
    res.json(updates);
  })
  .catch(function(err) {
    console.log(err)
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
    })
  })
}

exports.delete = function(req, res) {
  const slideId = req.params.slideId
  Slide.findById(slideId)
  .populate({path:'boxIds', model:'Box', populate : {path : 'content.imageId', model: 'Image' }}).exec()
  .then(function(slide) {
    var boxes = slide.boxIds;
    var boxIds = boxes.map(function(box) { return box._id })
    var images = [].concat.apply([], boxes.map(function(box) { return box.content.imageId || ''} ));
    if(images.length){
      var imageIds = images.map(function(image) { return image._id });
    }
    var presentation =  Presentation.findById(slide.presentationId)
    .populate({ path : 'slideIds'});
    return Promise.all([
      Promise.resolve({
        presentation : presentation,
        boxIds: boxIds,
        imageIds : imageIds
      }),
      Box.remove({ _id: { $in: boxIds } }),
      Image.remove({ _id: { $in: imageIds } })
    ])
  })
   .then(function(result) {
     return result[0].presentation.exec();
   })
  .then(function(presentation) {

    console.log('slideId', JSON.stringify(slideId))

    const index = presentation.slideIds
    .map(function(slide){
      return slide._id
    })
    .findIndex(function(id) {
      return id.toString() === slideId.toString();
    })

    const updateSlides = presentation.slideIds
    .slice(index + 1)
    .map(function(slide) {
      slide.index = slide.index - 1;
      return Slide.findByIdAndUpdate(slide._id, slide.toObject(), { new: true })
    });

    presentation.slideIds.splice(index, 1);
    presentation.slideIds = presentation.slideIds.map(function(slide){
      return slide._id
    })


    return Promise.all(
      [Slide.findByIdAndRemove(slideId).exec()]
      .concat(updateSlides)
      .concat([Presentation.findByIdAndUpdate(presentation._id, presentation)]
    ))
    .then(function(result) {
      return res.json(result[0]);
    })
  })
  .then(function(updateSlides) {

  })
  .catch(function(err) {
    console.log(err)
    return res.status(422).send({
    message: errorHandler.getErrorMessage(err)
    })
  });
};

exports.findOneById = function(req, res) {

  const slideId = req.params.slideId;

  if (!mongoose.Types.ObjectId.isValid(slideId)) {

    return res.status(400).send({
      message: 'slide is invalid'
    });
  }
  Slide.findById(slideId).populate({
    path: 'boxIds',
    populate : {path : 'content.imageId', model: 'Image'}
   })
   .exec()
   .then(function(slide) {
     return res.json(slide);
   })
  .catch(function(err) {
    return res.status(404).send({
      message: 'No slide with that identifier has been found'
    });
  });
};

exports.findOneByPresentationId = function(req, res) {

  const presentationId = req.params.presentationId;

  if (!mongoose.Types.ObjectId.isValid(presentationId)) {
    return res.status(400).send({
      message: 'presentationId is invalid'
    });
  }

  Presentation.findById(presentationId)
  .populate('slideIds')
  .exec()
  .then(function(presentation) {
    return res.json(presentation.slideIds);
  })
  .catch(function(err) {
    console.log(err)
    return res.status(404).send({
      message: 'No slide with that identifier has been found'
    });
  });
};

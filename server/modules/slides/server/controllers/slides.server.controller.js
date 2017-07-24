'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  http = require('http'),
  fs = require('fs'),
  Slides = mongoose.model('Slides'),
  Image = mongoose.model('Image'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  ObjectId = mongoose.Schema.ObjectId,

  user = require(path.resolve('./modules/users/server/controllers/users/users.profile.server.controller'));
/**
 * Create an slide
 */
exports.create = function(req, res) {
  var slide = new Slides(req.body);
  slide.user = req.user;
  slide.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(slide);
    }
  });
};

/**
 * Show the current slide
 */
exports.read = function(req, res) {
  var slide = req.slide ? req.slide.toJSON() : {};
  slide.isCurrentUserOwner = !!(req.user && slide.user && slide.user._id.toString() === req.user._id.toString());
  res.json(slide);
};

/**
 * Update an slide
 */
exports.update = function(req, res) {
  var slides = req.slide;
  slides.slidesSetting = req.body.slidesSetting;

  //transfer image object to id string
  if (slides.slidesSetting.banner && slides.slidesSetting.banner._id) slides.slidesSetting.banner = slides.slidesSetting.banner._id;
  if (slides.slides.slideImage && slides.slides.slideImage._id) slides.slides.slideImage = slides.slides.slideImage._id;

  slides.slides = req.body.slides;
  slides.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(slides);
    }
  });
};

/**
 * Delete an slide
 */
exports.delete = function(req, res) {
  var slide = req.slide;

  slide.remove(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(slide);
    }
  });
};

/**
 * List of slides
 */
exports.list = function(req, res) {
  Slides.find().sort('-created').populate('user', 'displayName').exec(function(err, slides) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(slides);
    }
  });
};
/**
 * List of private slides
 */
exports.myList = function(req, res) {
  Slides.find({
      $or: [{
        'slidesSetting.author': req.query.username
      }, {
        'slidesSetting.public': true
      }]
    }).sort('-created')
    .populate({
      path: 'slidesSetting.banner',
      model: 'Image'
    }).exec(function(err, slides) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(slides);
      }
    });
};
/**
 * slide middleware
 */
exports.slideByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'slide is invalid'
    });
  }

  Slides.findById(id).populate('slides.slideImage', 'path').exec(function(err, slide) {
    if (err) {
      return next(err);
    } else if (!slide) {
      return res.status(404).send({
        message: 'No slide with that identifier has been found'
      });
    }
    req.slide = slide;
    next();
  });
};
/**
 * search with filter
 */
exports.search = function(req, res) {
  var regexS = new RegExp((req.query.title) || '');
  if (req.query.state === 'Public') {
    if (req.query.favorite === 'favorite') {
      Slides.find({
          $and: [{
            $or: [{
              'slidesSetting.title': regexS
            }, {
              'slidesSetting.tags': regexS
            }]
          }, {
            'slidesSetting.public': true
          }, {
            'slidesSetting.favorite': true
          }]
        }).sort({
          "slidesSetting.title": 1
        })
        .populate({
          path: 'slidesSetting.banner',
          model: 'Image'
        }).exec(function(err, slides) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(slides);
          }
        });
    } else if (req.query.favorite === 'notFavorite') {
      Slides.find({
          $and: [{
            $or: [{
              'slidesSetting.title': regexS
            }, {
              'slidesSetting.tags': regexS
            }]
          }, {
            'slidesSetting.public': true
          }, {
            'slidesSetting.favorite': false
          }]
        }).sort({
          "slidesSetting.title": 1
        })
        .populate({
          path: 'slidesSetting.banner',
          model: 'Image'
        }).exec(function(err, slides) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(slides);
          }
        });
    } else {
      Slides.find({
          $and: [{
            $or: [{
              'slidesSetting.title': regexS
            }, {
              'slidesSetting.tags': regexS
            }]
          }, {
            'slidesSetting.public': true
          }]
        }).sort({
          "slidesSetting.title": 1
        })
        .populate({
          path: 'slidesSetting.banner',
          model: 'Image'
        }).exec(function(err, slides) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(slides);
          }
        });
    }
  } else if (req.query.state === 'Private') {
    if (req.query.favorite === 'favorite') {
      Slides.find({
          $and: [{
            $or: [{
              'slidesSetting.title': regexS
            }, {
              'slidesSetting.tags': regexS
            }]
          }, {
            'slidesSetting.author': req.query.username
          }, {
            'slidesSetting.public': false
          }, {
            'slidesSetting.favorite': true
          }]
        }).sort({
          "slidesSetting.title": 1
        })
        .populate({
          path: 'slidesSetting.banner',
          model: 'Image'
        }).exec(function(err, slides) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(slides);
          }
        });
    } else if (req.query.favorite === 'notFavorite') {
      Slides.find({
          $and: [{
            $or: [{
              'slidesSetting.title': regexS
            }, {
              'slidesSetting.tags': regexS
            }]
          }, {
            'slidesSetting.author': req.query.username
          }, {
            'slidesSetting.public': false
          }, {
            'slidesSetting.favorite': false
          }]
        }).sort({
          "slidesSetting.title": 1
        })
        .populate({
          path: 'slidesSetting.banner',
          model: 'Image'
        }).exec(function(err, slides) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(slides);
          }
        });
    } else {
      Slides.find({
          $and: [{
            $or: [{
              'slidesSetting.title': regexS
            }, {
              'slidesSetting.tags': regexS
            }]
          }, {
            'slidesSetting.author': req.query.username
          }, {
            'slidesSetting.public': false
          }]
        }).sort({
          "slidesSetting.title": 1
        })
        .populate({
          path: 'slidesSetting.banner',
          model: 'Image'
        }).exec(function(err, slides) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(slides);
          }
        });
    }
  } else {
    console.log("list")
    if (req.query.favorite === 'favorite') {
      Slides.find({
          $and: [{
            $or: [{
              'slidesSetting.title': {
                $regex: regexS,
                $options: "i"
              }
            }, {
              'slidesSetting.tags': {
                $regex: regexS,
                $options: "i"
              }
            }]
          }, {
            $or: [{
              'slidesSetting.author': req.query.username
            }, {
              'slidesSetting.public': true
            }]
          }, {
            'slidesSetting.favorite': true
          }]
        }).sort({
          "slidesSetting.title": 1
        })
        .populate({
          path: 'slidesSetting.banner',
          model: 'Image'
        }).exec(function(err, slides) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(slides);
          }
        });
    } else if (req.query.favorite === 'notFavorite') {
      Slides.find({
          $and: [{
            $or: [{
              'slidesSetting.title': {
                $regex: regexS,
                $options: "i"
              }
            }, {
              'slidesSetting.tags': {
                $regex: regexS,
                $options: "i"
              }
            }]
          }, {
            $or: [{
              'slidesSetting.author': req.query.username
            }, {
              'slidesSetting.public': true
            }]
          }, {
            'slidesSetting.favorite': false
          }]
        }).sort({
          "slidesSetting.title": 1
        })
        .populate({
          path: 'slidesSetting.banner',
          model: 'Image'
        }).exec(function(err, slides) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(slides);
          }
        });
    } else {
      Slides.find({
          $and: [{
            $or: [{
              'slidesSetting.title': {
                $regex: regexS,
                $options: "i"
              }
            }, {
              'slidesSetting.tags': {
                $regex: regexS,
                $options: "i"
              }
            }]
          }, {
            $or: [{
              'slidesSetting.author': req.query.username
            }, {
              'slidesSetting.public': true
            }]
          }]
        }).sort({
          "slidesSetting.title": 1
        })
        .populate({
          path: 'slidesSetting.banner',
          model: 'Image'
        }).exec(function(err, slides) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(slides);
          }
        });
    }
  }
};

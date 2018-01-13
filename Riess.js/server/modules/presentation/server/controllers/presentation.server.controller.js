'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  http = require('http'),
  fs = require('fs'),
  Presentation = mongoose.model('Presentation'),
  Image = mongoose.model('Image'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  ObjectId = mongoose.Schema.ObjectId,
  Promise = require('promise');

/**
 * Create an presentation
 */
exports.create = function(req, res) {
  var presentation = new Presentation(req.body);
  presentation.user = req.user;
  presentation.title += ' '
  presentation.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(presentation);
    }
  });
};

/**
 * Show the current presentation
 */
exports.read = function(req, res) {
  var presentation = req.presentation ? req.presentation.toJSON() : {};
  presentation.isCurrentUserOwner = !!(req.user && presentation.user && presentation.user._id.toString() === req.user._id.toString());
  res.json(presentation);
};

/**
 * Update an presentation
 */
exports.update = function(req, res, next) {
  //transfer image object to id string
  //if (presentation.presentation.slideImage && presentation.presentation.slideImage._id) presentation.presentation.slideImage = presentation.presentation.slideImage._id;

  Presentation.findByIdAndUpdate(req.params.presentationId, req.body)
  .exec()
  .then(function(presentation) {
    res.json(presentation);
  })
  .catch(function(err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
    })
  })


//console.log({ ...presentation, ...req.presentation })
/*
  presentation.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(presentation);
    }
  });*/
};

/**
 * Delete an presentation
 */
exports.delete = function(req, res) {
  Presentation.findOneById(req.params.presentationId, function(err, customer) {
    Presentation.remove();
  })
//  Presentation.findByIdAndRemove(req.params.presentationId)
  .exec()
  .then(function(presentation) {
    res.json(presentation);
  })
  .catch(function(err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of presentation
 */
exports.list = function(req, res) {
  Presentation.find()
  .sort('-created')
  .populate('user', 'displayName')
  .exec()
  .then(function(presentation) {
    return res.json(presentation);
  })
  .catch(function(err, presentation) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of private presentation
 */
exports.myList = function(req, res) {
  Presentation.find({
      $or: [{
        'author': req.query.username
      }, {
        'public': true
      }]
    }).sort('-created').exec(function(err, presentation) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(presentation);
      }
    });
};

/**
 * presentation middleware
 */
exports.presentationByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'presentation is invalid'
    });
  }

  Presentation.findById(id).exec(function(err, presentation) {
    if (err) {
      return next(err);
    } else if (!presentation) {
      return res.status(404).send({
        message: 'No presentation with that identifier has been found'
      });
    }
    req.presentation = presentation;
    next();
  });
};

/**
 * search with filter
 */
exports.search = function(req, res) {
  var pageIndex = parseInt(req.query.pageIndex ,10);
  var pageSize = parseInt(req.query.pageSize ,10);
  var request = null;
  var totalResultsCount = null;
  var regexS = new RegExp((req.query.title) || '');
  if (req.query.state === 'Public') {
    if (req.query.favorite === 'favorite') {
      request = Presentation.find({
          $and: [{
            $or: [{
              'presentationSetting.title': regexS
            }, {
              'presentationSetting.tags': regexS
            }]
          }, {
            'presentationSetting.public': true
          }, {
            'presentationSetting.favorite': true
          }]
        });
      totalResultsCount = Presentation.find({
        $and: [{
          $or: [{
            'presentationSetting.title': regexS
          }, {
            'presentationSetting.tags': regexS
          }]
        }, {
          'presentationSetting.public': true
        }, {
          'presentationSetting.favorite': true
        }]
      }).count();
    } else if (req.query.favorite === 'notFavorite') {
      request = Presentation.find({
        $and: [{
          $or: [{
            'presentationSetting.title': regexS
          }, {
            'presentationSetting.tags': regexS
          }]
        }, {
          'presentationSetting.public': true
        }, {
          'presentationSetting.favorite': false
        }]
      });
      totalResultsCount = Presentation.find({
        $and: [{
          $or: [{
            'presentationSetting.title': regexS
          }, {
            'presentationSetting.tags': regexS
          }]
        }, {
          'presentationSetting.public': true
        }, {
          'presentationSetting.favorite': false
        }]
      }).count();
    } else {
      request = Presentation.find({
          $and: [{
            $or: [{
              'presentationSetting.title': regexS
            }, {
              'presentationSetting.tags': regexS
            }]
          }, {
            'presentationSetting.public': true
          }]
        });
      totalResultsCount = Presentation.find({
        $and: [{
          $or: [{
            'presentationSetting.title': regexS
          }, {
            'presentationSetting.tags': regexS
          }]
        }, {
          'presentationSetting.public': true
        }]
      }).count();
    }
  } else if (req.query.state === 'Private') {
    if (req.query.favorite === 'favorite') {
      request = Presentation.find({
          $and: [{
            $or: [{
              'presentationSetting.title': regexS
            }, {
              'presentationSetting.tags': regexS
            }]
          }, {
            'presentationSetting.author': req.query.username
          }, {
            'presentationSetting.public': false
          }, {
            'presentationSetting.favorite': true
          }]
        });
      totalResultsCount = Presentation.find({
        $and: [{
          $or: [{
            'presentationSetting.title': regexS
          }, {
            'presentationSetting.tags': regexS
          }]
        }, {
          'presentationSetting.author': req.query.username
        }, {
          'presentationSetting.public': false
        }, {
          'presentationSetting.favorite': true
        }]
      }).count();
    } else if (req.query.favorite === 'notFavorite') {
      request = Presentation.find({
          $and: [{
            $or: [{
              'presentationSetting.title': regexS
            }, {
              'presentationSetting.tags': regexS
            }]
          }, {
            'presentationSetting.author': req.query.username
          }, {
            'presentationSetting.public': false
          }, {
            'presentationSetting.favorite': false
          }]
        });
      totalResultsCount = Presentation.find({
        $and: [{
          $or: [{
            'presentationSetting.title': regexS
          }, {
            'presentationSetting.tags': regexS
          }]
        }, {
          'presentationSetting.author': req.query.username
        }, {
          'presentationSetting.public': false
        }, {
          'presentationSetting.favorite': false
        }]
      }).count();
    }
    else {
      request = Presentation.find({
        $and: [{
          $or: [{
            'presentationSetting.title': regexS
          }, {
            'presentationSetting.tags': regexS
          }]
        }, {
          'presentationSetting.author': req.query.username
        }, {
          'presentationSetting.public': false
        }]
      });
      totalResultsCount = Presentation.find({
        $and: [{
          $or: [{
            'presentationSetting.title': regexS
          }, {
            'presentationSetting.tags': regexS
          }]
        }, {
          'presentationSetting.author': req.query.username
        }, {
          'presentationSetting.public': false
        }]
      }).count();
    }
  } else {
    if (req.query.favorite === 'favorite') {
      request = Presentation.find({
        $and: [{
          $or: [{
            'presentationSetting.title': {
              $regex: regexS,
              $options: "i"
            }
          }, {
            'presentationSetting.tags': {
              $regex: regexS,
              $options: "i"
            }
          }]
        }, {
          $or: [{
            'presentationSetting.author': req.query.username
          }, {
            'presentationSetting.public': true
          }]
        }, {
          'presentationSetting.favorite': true
        }]
      });
      totalResultsCount = Presentation.find({
        $and: [{
          $or: [{
            'presentationSetting.title': {
              $regex: regexS,
              $options: "i"
            }
          }, {
            'presentationSetting.tags': {
              $regex: regexS,
              $options: "i"
            }
          }]
        }, {
          $or: [{
            'presentationSetting.author': req.query.username
          }, {
            'presentationSetting.public': true
          }]
        }, {
          'presentationSetting.favorite': true
        }]
      }).count();
    } else if (req.query.favorite === 'notFavorite') {
      request = Presentation.find({
        $and: [{
          $or: [{
            'presentationSetting.title': {
              $regex: regexS,
              $options: "i"
            }
          }, {
            'presentationSetting.tags': {
              $regex: regexS,
              $options: "i"
            }
          }]
        }, {
          $or: [{
            'presentationSetting.author': req.query.username
          }, {
            'presentationSetting.public': true
          }]
        }, {
          'presentationSetting.favorite': false
        }]
      });
      totalResultsCount = Presentation.find({
        $and: [{
          $or: [{
            'presentationSetting.title': {
              $regex: regexS,
              $options: "i"
            }
          }, {
            'presentationSetting.tags': {
              $regex: regexS,
              $options: "i"
            }
          }]
        }, {
          $or: [{
            'presentationSetting.author': req.query.username
          }, {
            'presentationSetting.public': true
          }]
        }, {
          'presentationSetting.favorite': false
        }]
      }).count();
    } else {
      request = Presentation.find({
        $and: [{
          $or: [{
            'presentationSetting.title': {
              $regex: regexS,
              $options: "i"
            }
          }, {
            'presentationSetting.tags': {
              $regex: regexS,
              $options: "i"
            }
          }]
        }, {
          $or: [{
            'presentationSetting.author': req.query.username
          }, {
            'presentationSetting.public': true
          }]
        }]
      });
      totalResultsCount = Presentation.find({
        $and: [{
          $or: [{
            'presentationSetting.title': {
              $regex: regexS,
              $options: "i"
            }
          }, {
            'presentationSetting.tags': {
              $regex: regexS,
              $options: "i"
            }
          }]
        }, {
          $or: [{
            'presentationSetting.author': req.query.username
          }, {
            'presentationSetting.public': true
          }]
        }]
      }).count();
    }
  }
  var order = '';
  if (req.query.order === 'date') {
    order = '-createdAt';
  } else {
    order = { 'presentationSetting.title': 1 };
  }
  Promise.all([
      request.sort(order).skip(pageIndex > 0 ? (pageIndex * pageSize) : 0).limit(pageSize).exec(),
      totalResultsCount])
      .then(function(items) {
        res.json(items);
      }, function(err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });
};

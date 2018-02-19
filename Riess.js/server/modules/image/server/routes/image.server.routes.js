'use strict';

/**
 * Module dependencies
 */
var imagePolicy = require('../policies/image.server.policy'),
  image = require('../controllers/image.server.controller');

module.exports = function(app) {
  // users-list all image
  app.route('/api/images').all(imagePolicy.isAllowed)
  // .get(image.list)
  .post(image.create);

//   // Single image routes
//   app.route('/api/images/:imageId')
//   //.all(imagePolicy.isAllowed)
//   .get(image.findOneById)
//     .patch(image.update)
//     .delete(image.delete);
//
//     app.route('/api/imagees/:imageId')
// //    .all(imagePolicy.isAllowed)

};

'use strict';

/**
 * Module dependencies
 */
var imagePolicy = require('../policies/image.server.policy'),
  image = require('../controllers/image.server.controller');

module.exports = function(app) {
  // users-list all image
  app.route('/api/images').all(imagePolicy.isAllowed)
  .post(image.create)
  .patch(image.update);

//   // Single image routes
app.route('/api/images/:imageId')
.all(imagePolicy.isAllowed)
//   .get(image.findOneById)
.put(image.update)
.delete(image.delete);
//
//     app.route('/api/imagees/:imageId')
// //    .all(imagePolicy.isAllowed)

};

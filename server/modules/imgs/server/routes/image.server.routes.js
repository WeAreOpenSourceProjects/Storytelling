'use strict';

/**
 * Module dependencies
 */
var imagePolicy = require('../policies/image.server.policy'),
  image = require('../controllers/image.server.controller');

module.exports = function(app) {
  // image collection routes
  app.route('/api/imagesServer').all(imagePolicy.isAllowed)
    .get(image.listServer)
    .post(image.createServer);
  app.route('/api/images').all(imagePolicy.isAllowed)
    .get(image.list)
    .post(image.create);

  // Single image routes
  app.route('/api/images/:imageId').all(imagePolicy.isAllowed)
    .get(image.read)
    // .put(image.update)
    .delete(image.delete);



  // Finish by binding the image middleware
  app.param('imageId', image.imageByID);
};

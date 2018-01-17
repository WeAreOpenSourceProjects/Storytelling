'use strict';

/**
 * Module dependencies
 */
var presentationPolicy = require('../policies/presentation.server.policy'),
  presentation = require('../controllers/presentation.server.controller');

module.exports = function(app) {
  // users-list all presentations
  app.route('/api/presentations')
  //  .all(presentationPolicy.isAllowed)
  .get(presentation.list)
  .post(presentation.create);

  // users-list private presentation
  app.route('/api/presentations/me')
  .all(presentationPolicy.isAllowed)
  .get(presentation.myList);

  //search presentation
  app.route('/api/presentations/search')
//  .all(presentationPolicy.isAllowed)
  .get(presentation.search);

  app.route('/api/presentations/copy')
//  .all(presentationPolicy.isAllowed)
  .post(presentation.copy);

  // Single presentation routes
  app.param('presentationId', presentation.presentationByID)
  .route('/api/presentations/:presentationId')
//  .all(presentationPolicy.isAllowed)
  .get(presentation.read)

  app.route('/api/presentations/:presentationId')
//  .all(presentationPolicy.isAllowed)
  .patch(presentation.update)
  .delete(presentation.delete);


  // Finish by binding the presentation middleware
  //app.param('presentationId', presentation.presentationByID);

};

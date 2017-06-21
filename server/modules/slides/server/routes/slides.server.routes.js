'use strict';

/**
 * Module dependencies
 */
var slidesPolicy = require('../policies/slides.server.policy'),
  slides = require('../controllers/slides.server.controller');

module.exports = function(app) {
  // slides collection routes
  app.route('/api/slides').all(slidesPolicy.isAllowed)
    .get(slides.list)
    .post(slides.create);

  // Own slides
  app.route('/api/slides/me').all(slidesPolicy.isAllowed)
    .get(slides.myList);

  app.route('/api/search/slides').all(slidesPolicy.isAllowed)
    .get(slides.search);

  // Single slide routes
  app.route('/api/slides/:slideId').all(slidesPolicy.isAllowed)
    .get(slides.read)
    .put(slides.update)
    .delete(slides.delete);

  app.route('/api/slidesFix/:slideIdFix').all(slidesPolicy.isAllowed)
    .get(slides.readFix);



  // Finish by binding the slide middleware
 app.param('slideId', slides.slideByID);//for getting slide that use to edit
 app.param('slideIdFix', slides.slideByIDFix);//for getting slide that not use to edit
};

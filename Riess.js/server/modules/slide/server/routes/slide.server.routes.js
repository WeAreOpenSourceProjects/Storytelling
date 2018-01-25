'use strict';

var slidePolicy = require('../policies/slide.server.policy'),
  slide = require('../controllers/slide.server.controller');

module.exports = function(app) {

  app.route('/api/slides/:slideId').all(slidePolicy.isAllowed)
  .get(slide.findOneById)
  .delete(slide.delete);

  app.route('/api/slides').all(slidePolicy.isAllowed)
  .post(slide.create)
  .patch(slide.bulkUpdate);

  app.route('/api/slides/presentation/:presentationId')//.all(slidePolicy.isAllowed)
  .get(slide.findOneByPresentationId);
};

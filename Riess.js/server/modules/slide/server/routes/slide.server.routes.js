'use strict';

var slidePolicy = require('../policies/slide.server.policy'),
  slide = require('../controllers/slide.server.controller');

module.exports = function(app) {

  app.route('/api/slides/:slideId').all(slidePolicy.isAllowed)
  .get(slide.findOneByID)
  .patch(slide.update)
  .delete(slide.delete);

  app.route('/api/slides').all(slidePolicy.isAllowed)
  .post(slide.create);

};

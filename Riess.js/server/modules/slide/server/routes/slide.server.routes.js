'use strict';

var slidePolicy = require('../policies/slide.server.policy'),
  slide = require('../controllers/slide.server.controller');

module.exports = function(app) {

  app.route('/api/slide/:slideId').all(slidePolicy.isAllowed)
  .get(slide.findOneByID)
  .patch(slide.update)
  .delete(slide.delete);

  app.route('/api/slide').all(slidePolicy.isAllowed)
  .post(slide.create);

};

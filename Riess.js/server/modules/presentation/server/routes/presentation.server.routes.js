'use strict';

var presentationPolicy = require('../policies/presentation.server.policy'),
  presentation = require('../controllers/presentation.server.controller'),
  passport = require('passport');

module.exports = function(app) {

  app.route('/api/presentations/search')
//  .all(presentationPolicy.isAllowed)
  .get(presentation.search);

  app.route('/api/presentations/copy')
  //  .all(presentationPolicy.isAllowed)
  .post(passport.authenticate('jwt'), passport.authenticate('jwt'), presentation.copy);

  app.route('/api/presentations/:presentationId')
//  .all(presentationPolicy.isAllowed)
  .get(presentation.findOneById)
  .patch(passport.authenticate('jwt'), presentation.update)
  .delete(passport.authenticate('jwt'), presentation.delete);

  app.route('/api/presentations/:presentationId/share')
  //  .all(presentationPolicy.isAllowed)
    .get(presentation.findOneById)
    .patch(passport.authenticate('jwt'), presentation.updateWithShare);
  app.route('/api/presentations')
  //  .all(presentationPolicy.isAllowed)
  .post(passport.authenticate('jwt'), presentation.create);
};

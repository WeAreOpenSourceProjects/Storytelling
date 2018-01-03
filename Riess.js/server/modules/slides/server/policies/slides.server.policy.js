'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke slides Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/slides',
      permissions: '*'
    }, {
      resources: '/api/slides/:slidesId',
      permissions: '*'
    }, {
      resources: '/api/search/slides',
      permissions: ['*']
    }, {
      resources: '/api/slidesFix/:slideIdFix',
      permissions: ['*']
    }, {
      resources: '/api/slides/me',
      permissions: ['*']
    }, {
      resources: '/api/slides/banner',
      permissions: ['*']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/slides',
      permissions: ['*']
    }, {
      resources: '/api/slides/:slidesId',
      permissions: ['*']
    }, {
      resources: '/api/slidesFix/:slideIdFix',
      permissions: ['*']
    }, {
      resources: '/api/search/slides',
      permissions: ['*']
    },  {
      resources: '/api/slides/me',
      permissions: ['*']
    }, {
      resources: '/api/banner',
      permissions: ['*']
    }, {
      resources: '/api/slides/:idSlides/slide/:id',
      permissions: ['*']
    },
      {
        resources: '/api/slides/:slidesId/slide/:slideId',
        permissions: ['*']
      }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/slides',
      permissions: ['*']
    }, {
      resources: '/api/slides/:slidesId',
      permissions: ['*']
    }, {
      resources: '/api/slidesFix/:slideIdFix',
      permissions: ['*']
    }, {
      resources: '/api/search/slides',
      permissions: ['*']
    },{
      resources: '/api/slides/me',
      permissions: ['*']
    }, {
      resources: '/api/banner',
      permissions: ['*']
    },
      {
        resources: '/api/slides/:slidesId/slide/:slideId',
        permissions: ['*']
      }]
  }]);
};

/**
 * Check If slides Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];
  // If an slide is being processed and the current user created it then allow any manipulation
  if (req.slide && req.user && req.slide.user && req.slide.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};

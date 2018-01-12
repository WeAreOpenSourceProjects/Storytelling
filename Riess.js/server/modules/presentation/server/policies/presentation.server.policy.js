'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke presentation Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/presentation',
      permissions: '*'
    }, {
      resources: '/api/presentation/:presentationId',
      permissions: '*'
    }, {
      resources: '/api/search/presentation',
      permissions: ['*']
    }, {
      resources: '/api/presentation/me',
      permissions: ['*']
    }, {
      resources: '/api/presentation/banner',
      permissions: ['*']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/presentation',
      permissions: ['*']
    }, {
      resources: '/api/presentation/:presentationId',
      permissions: ['*']
    }, {
      resources: '/api/search/presentation',
      permissions: ['*']
    },  {
      resources: '/api/presentation/me',
      permissions: ['*']
    }, {
      resources: '/api/banner',
      permissions: ['*']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/presentation',
      permissions: ['*']
    }, {
      resources: '/api/presentation/:presentationId',
      permissions: ['*']
    }, {
      resources: '/api/search/presentation',
      permissions: ['*']
    },{
      resources: '/api/presentation/me',
      permissions: ['*']
    }, {
      resources: '/api/banner',
      permissions: ['*']
    }]
  }]);
};

/**
 * Check If presentation Policy Allows
 */
exports.isAllowed = function (req, res, next) {

  // !!! var roles = (req.user) ? req.user.roles : ['guest'];

  var roles = ['guest'];

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

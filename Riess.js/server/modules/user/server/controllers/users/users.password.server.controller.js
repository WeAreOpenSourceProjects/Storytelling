'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./lib/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  crypto = require('crypto'),
  UserService = require(path.resolve('./modules/user/server/services/user.service'));


var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {
  async.waterfall([
    // Generate random token
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by username
    function (token, done) {
      if (req.body.email) {
        User.findOne({
          email: req.body.email.email
        }, '-salt -password', function (err, user) {
          if (err || !user) {
            return res.json({
              message: 'No account with that email has been found'
            });
          } else if (user.provider !== 'local') {
            return res.json({
              message: 'It seems like you signed up using your ' + user.provider + ' account'
            });
          } else {

            user.resetPasswordToken = token;
            user.resetPasswordExpires = (new Date(Date.now() + 60 * 60 * 24 * 1000)).getTime(); // 1 hour
            console.log(Date.now() + 3600000)
            user.save(function (err) {
              done(err, token, user);
            });
          }
        });
      } else {
        return res.status(422).send({
          message: 'Username field must not be blank'
        });
      }
    },
    function (token, user, done) {

      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = httpTransport + process.env.HOST + ':' + process.env.FRONT_PORT;
      res.render('modules/user/server/templates/reset-password-email', {
        name: user.username,
        appName: config.app.title,
        url: baseUrl + '/auth/' + token
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Password Reset',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          return res.status(400).send({
            message: 'Failure sending email'
          });
        }

        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  async.waterfall([
    function (done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, async function (err, user) {
        if(err || !user ) {
          console.log(err);
          return  res.status(422).send({message : 'Invalid link '});
        }
        else if (!err && user) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              try {
                const userModified = await UserService.changePassword(user, passwordDetails.newPassword);
                userModified.resetPasswordToken = undefined;
                userModified.resetPasswordExpires = undefined;

                userModified.save(function (err) {
                  if (err) {
                    return res.status(422).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    req.login(userModified, function (err) {
                      if (err) {
                        res.json(err);
                      } else {
                        // Remove sensitive data before return authenticated user
                        userModified.password = undefined;
                        userModified.salt = undefined;
                        res.json({user : {
                          firstName : userModified.firstName,
                          lastName :userModified.lastName,
                          username : userModified.username,
                          email : userModified.email,
                          id : userModified._id}, tokenExpiresIn: (new Date(Date.now() + 60 * 60 * 24 * 1000)).getTime()});
                        done(err, user);
                      }
                    });
                  }
                });
            }catch(err) {
              return next(err)
            }

          } else {
            return res.status(422).send({
              message: 'Passwords do not match'
            });
          }
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      });
    },
    function (user, done) {
      res.render('modules/user/server/templates/reset-password-confirm-email', {
        name: user.username,
        appName: config.app.title
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Your password has been changed',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, function (err) {
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Change Password
 */
exports.changePassword = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, function (err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;

              user.save(function (err) {
                if (err) {
                  return res.status(422).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  req.login(user, function (err) {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.send({
                        message: 'Password changed successfully'
                      });
                    }
                  });
                }
              });
            } else {
              res.status(422).send({
                message: 'Passwords do not match'
              });
            }
          } else {
            res.status(422).send({
              message: 'Current password is incorrect'
            });
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          });
        }
      });
    } else {
      res.status(422).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};

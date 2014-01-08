var passport = require('passport');
var PassportLocalStrategy = require('passport-local').Strategy;
var user = require('../models/User');

var callbacks = function(res, success, message){
  res.json({
    success: success,
    message: message
  });
}

var AuthController = {
    // Login a user
  login: passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
  }),
  register: function(req, res){
    user.register(req, res);
  },

  // on Login Success callback
  loginSuccess: function(req, res){
    callbacks(res, true, req.session.passport.user);
  },

  // on Login Failure callback
  loginFailure: function(req, res){
    callbacks(res, false, 'Invalid username or password.');
  },

  // Log out a user
  logout: function(req, res){
    req.logout();
    res.redirect('/');
  },
  restrict: function(req, res, next){
    if (!req.user) {
      res.redirect('/');
    } else {
      next();
    }
  }
};

module.exports = AuthController;
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var cors = require('cors');
var passport = require('passport');
var flash = require('connect-flash');

var routes = require('./routes');
var auth = require('./controllers/authController');
var Vote = require('./models/Vote');
var User = require('./models/User').authTable;

//passport setup
passport.use(User.localStrategy);
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser('qwertyyui'));
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(express.methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

//passport environments
app.use(flash());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//index serving
app.get('/', routes.index);
app.get('/admin', routes.admin);

//Voting routes
app.post('/votes', Vote.createVote);
app.get('/votes/:vidID', Vote.getVotes);

//use passport to authenticate any login attempts
app.post('/auth/register', auth.register);
app.post('/auth/login', auth.login);
app.post('/auth/logout', auth.logout);
app.get('/auth/login/success', auth.loginSuccess);
app.get('/auth/login/failure', auth.loginFailure);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
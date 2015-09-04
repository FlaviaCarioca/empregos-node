var express = require('express');
var path = require('path');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var timezone = require('moment-timezone');
var cors = require('cors');
var config = require('./config.json')[process.env.NODE_ENV];
var auth = require('./lib/auth'); // Secure routes

var users = require('./routes/api/v1/users');
var candidates = require('./routes/api/v1/candidates');

var app = express();
app.use(cors());

app.set('dbConnectionString', config.database);
app.set('superSecret', config.secret);
app.disable('x-powered-by'); // Nobody needs to know this is an express app

/* Constants */
app.set('Candidate', 'Candidate');

// create a write stream (in append mode)
var logStream = fs.createWriteStream(__dirname + '/log.log', { flags: 'a' })
app.use(logger('combined', { stream: logStream })); // Use morgan to log requests to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

authVerification = auth.authVerification;

/* USER Routes - These don't require a token */
app.post('/v1/auth', users.authenticate);
app.post('/v1/users', users.create);

// // Route middleware to verify the token and secure routes
// // This is added after the authenticate route because that on won't
// // have a token. ORDER IS IMPORTANT HERE!!!!!!!
// // The routes placed after this middleware will HAVE TO HAVE a token.
// authVerification = auth.authVerification;

/* CANDIDATE Routes */
app.put('/v1/candidate', authVerification, candidates.update);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.json({
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: {}
	});
});


module.exports = app;

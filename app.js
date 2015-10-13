var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var timezone = require('moment-timezone');
var cors = require('cors');
var config = require('./config.json')[process.env.NODE_ENV];
var auth = require('./lib/auth'); // Secure routes
var fs = require('fs');
var app = express();
var logStream = fs.createWriteStream(__dirname + '/log.log', { flags: 'a' });
var users = require('./routes/api/v1/users');
var candidates = require('./routes/api/v1/candidates');

app.disable('x-powered-by'); // Nobody needs to know this is an express app
app.set('CANDIDATE', 'Candidate');
app.set('dbConnectionString', config.database);
app.set('superSecret', config.secret);
app.set('CANDIDATE', 'Candidate');

app.configure(function() {
	app.use(cors());
	// create a write stream (in append mode)
	app.use(logger('combined', { stream: logStream })); // Use morgan to log requests to the console
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
});


/* USER Routes */
app.post('/v1/auth', users.authenticate);
app.post('/v1/users', users.create);

/* CANDIDATE Routes */
app.put('/v1/candidate', auth.authVerification, candidates.update);

// TODO: Work on this !!!!
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler. Will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.json({
			message: err.message,
			error: err
		});
	});
}

// production error handler. No stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: {}
	});
});


module.exports = app;

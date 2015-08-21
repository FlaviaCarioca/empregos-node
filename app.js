var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var timezone = require('moment-timezone');

var users = require('./routes/api/v1/users');
var candidates = require('./routes/api/v1/candidates');

var app = express();

var conString = process.env.DATABASE_URL || 'postgres://fgoncalves:pafu2ncia@localhost:5432/emprego_development';
app.set('dbConnectionString', conString);

/* Constants */
app.set('Candidate', 'Candidate');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* USER Routes */
app.post('/api/v1/users', users.create);

/* CANDIDATE Routes */
app.post('/api/v1/candidate', candidates.update);

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
    res.json({ message: err.message, error: err });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ message: err.message, error: {} });
});


module.exports = app;

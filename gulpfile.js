var gulp = require('gulp');
var supervisor = require('gulp-supervisor');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var env = require('gulp-env');

gulp.task('supervisor', function() {
  env({
    vars: {
      NODE_ENV: 'development',
      PORT: 3000
    }
  });
  return supervisor("./bin/www");
});

gulp.task('mocha', function() {
  env({
    vars: {
      NODE_ENV: 'testing',
      PORT: 3001
    }
  });
  return gulp.src(['./routes/**/*.js', 'app.js'])
    .pipe(istanbul()) // Covering files
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(['test/*.js'])
        .pipe(mocha({ bail: false, reporter: "spec" }))
        .pipe(istanbul.writeReports({ dir: './coverage', reporters: [ 'lcov' ], reportOpts: { dir: './coverage'} })); // Creating the reports after tests ran
        //.pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } })) // Enforce a coverage of at least 90%
    });
});

// JSHint
gulp.task('scripts', function () {
  return gulp.src(['./routes/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
});

gulp.task('default', ['supervisor', 'scripts']);

gulp.task('test', ['mocha']);

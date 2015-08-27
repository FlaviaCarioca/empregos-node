var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var env = require('gulp-env');

// Watch Files For Changes
gulp.task('watch', function () {
  gulp.watch(['./routes/**/*.js', './test**/*.js'], ['lint']);
});

// JSHint
gulp.task('lint', function () {
  return gulp.src(['./routes/**/*.js', './test**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// Re-start after changes
gulp.task('nodemon', function () {
  nodemon({
    script: 'app.js',
    ext: 'js',
    env: {
      'NODE_ENV': 'development',
      'PORT': 3000
    }
  })
    .on('start', ['watch']);
    //.on('change', ['watch']);
});

gulp.task('mocha', function() {
  env({
    vars: {
      NODE_ENV: 'testing',
      PORT: 3000
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

gulp.task('default', ['nodemon']);

gulp.task('test', ['mocha']);

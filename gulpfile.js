var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var env = require('gulp-env');

// JSHint
gulp.task('lint', function () {
  return gulp.src(['./routes/**/*.js', './test**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// Watch Files For Changes and Re-start after changes
gulp.task('nodemon', function () {
  nodemon({
    script: './bin/www',
    watch: ['./routes/**/*.js', './test**/*.js'],
    verbose: true,
    ext: 'js',
    tasks: ['lint', 'mocha'],
    env: {
      'NODE_ENV': 'development'
    }
  })
  .on('restart', function() {
        console.log('Restarted!');
    });
});

gulp.task('mocha', function() {
  env({
     vars: {
       NODE_ENV: 'test',
       PORT: 3000
     }
   });
  return gulp.src('./routes/**/*.js')
    .pipe(istanbul()) // Covering files
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(['test/*.js'], { read: false })
        .pipe(mocha({ reporter: "spec" }))
        .pipe(istanbul.writeReports({ dir: './coverage', reporters: [ 'lcov' ], reportOpts: { dir: './coverage'} }));// Creating the reports after tests ran
    });
});

gulp.task('default', ['nodemon']);

gulp.task('test', ['mocha']);

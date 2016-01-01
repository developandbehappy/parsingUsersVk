var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var jscs = require('gulp-jscs');

gulp.task('eslint', function() {
  return gulp.src(['src/script/*.js',
          'src/script/*/*.js'])
         .pipe(eslint())
         .pipe(eslint.format())
         .pipe(eslint.failOnError());
});


gulp.task('test', ['eslint', 'jscs']);

gulp.task('jscs', function () {
      gulp.src(['src/*.js',
        'src/*/*.js'])
        .pipe(jscs());
});

gulp.task('connect', function () {
  return browserSync.init({
    files: [
      'index.html',
      'src/partials/*.html',
      'src/partials/*/*.html',
      'src/*.css',
      'src/*/*.js',
      'src/*.js'
    ],
    port: 3000,
    logConnections: true,
    notify: false,
    server: './'
  });
});

gulp.task('default',['connect']);
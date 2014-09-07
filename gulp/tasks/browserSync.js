var browserSync = require('browser-sync');
var gulp        = require('gulp');
var pkg         = require('../../package.json');

// note this will only work with coffee-only server running
// seems to fail when trying to run in conjunction with nodemon
gulp.task('browserSync', ['build'], function() {
  // browserSync.init([pkg.folders.dest+'/**'], {
  //   proxy: "127.0.0.1:3000"
  // });
});

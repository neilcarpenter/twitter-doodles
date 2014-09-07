/* bundleLogger
   ------------
   Provides gulp style logs to the bundle method in browserify.js
*/

var gutil        = require('gulp-util');
var prettyHrtime = require('pretty-hrtime');
var startTime;

module.exports = {
  start: function(name) {
    startTime = process.hrtime();
    gutil.log('Running', gutil.colors.green("'bundle-"+name+"'") + '...');
  },

  end: function(name) {
    var taskTime = process.hrtime(startTime);
    var prettyTime = prettyHrtime(taskTime);
    gutil.log('Finished', gutil.colors.green("'bundle-"+name+"'"), 'in', gutil.colors.magenta(prettyTime));
  }
};
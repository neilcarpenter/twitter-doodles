(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/neilcarpenter/Sites/twitter-doodles/project/worker/Main.coffee":[function(require,module,exports){
var Test, send;

Test = require('./test/Test');

send = typeof workerPostMessage !== 'undefined' ? workerPostMessage : postMessage;

this.onmessage = (function(_this) {
  return function(event) {
    switch (event.data.type) {
      case "loadDependency":
        importScripts(event.data.data);
    }
    return null;
  };
})(this);


},{"./test/Test":"/Users/neilcarpenter/Sites/twitter-doodles/project/worker/test/Test.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/worker/test/Test.coffee":[function(require,module,exports){
var Test;

Test = (function() {
  function Test() {}

  Test.prototype._test = function() {
    return console.log('testing');
  };

  return Test;

})();

module.exports = Test;


},{}]},{},["/Users/neilcarpenter/Sites/twitter-doodles/project/worker/Main.coffee"])
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/neilcarpenter/Sites/twitter-doodles/project/worker/Main.coffee":[function(require,module,exports){
var Cruncher, ENV, cruncher;

Cruncher = require('./cruncher/Cruncher');

self.send = typeof workerPostMessage !== 'undefined' ? workerPostMessage : postMessage;

cruncher = new Cruncher;

ENV = 'dev';

self.onmessage = (function(_this) {
  return function(event) {
    switch (event.data.type) {
      case "loadDependency":
        importScripts(event.data.data);
        break;
      case "setEnvironment":
        ENV = event.data.data;
        break;
      case "processTweets":
        cruncher.crunch(JSON.parse(event.data.data));
    }
    return null;
  };
})(this);


},{"./cruncher/Cruncher":"/Users/neilcarpenter/Sites/twitter-doodles/project/worker/cruncher/Cruncher.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/worker/cruncher/Cruncher.coffee":[function(require,module,exports){
var Cruncher, SampleProcessor, TweetsProcessor,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

SampleProcessor = require('../sample/SampleProcessor');

TweetsProcessor = require('../tweets/TweetsProcessor');

Cruncher = (function() {
  Cruncher.prototype.data = null;

  Cruncher.prototype.processedTweets = null;

  Cruncher.prototype.sampleProcessor = null;

  Cruncher.prototype.tweetsProcessor = null;

  function Cruncher() {
    this.crunch = __bind(this.crunch, this);
    this.sampleProcessor = new SampleProcessor;
    this.tweetsProcessor = new TweetsProcessor;
    return null;
  }


  /*
  	/
  	/ DATA CRUNCH
  	/ @param data = { task_id(INT), [tweets] }
  	/
   */

  Cruncher.prototype.crunch = function(data) {
    var result;
    this.data = data;
    this.task_id = this.data.task_id;
    if (!this.data.tweets.length) {
      return self.send({
        type: 'error',
        code: 1,
        data: JSON.stringify({
          task_id: this.data.task_id
        })
      });
    }
    result = {
      task_id: this.data.task_id,
      tweetsData: this.tweetsProcessor.process(this.data.tweets),
      tweetsSample: this.sampleProcessor.process(this.data.tweets)
    };
    self.send({
      type: 'result',
      method: 'processTweets',
      data: JSON.stringify(result)
    });
    return null;
  };

  return Cruncher;

})();

module.exports = Cruncher;


},{"../sample/SampleProcessor":"/Users/neilcarpenter/Sites/twitter-doodles/project/worker/sample/SampleProcessor.coffee","../tweets/TweetsProcessor":"/Users/neilcarpenter/Sites/twitter-doodles/project/worker/tweets/TweetsProcessor.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/worker/sample/SampleProcessor.coffee":[function(require,module,exports){
var SampleProcessor,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

SampleProcessor = (function() {
  function SampleProcessor() {
    this.process = __bind(this.process, this);
  }

  SampleProcessor.prototype.rawTweets = null;

  SampleProcessor.prototype.process = function(rawTweets) {
    var tweet, _i, _len, _ref;
    this.rawTweets = rawTweets;
    _ref = this.rawTweets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tweet = _ref[_i];
      tweet.SA_PROCESSED = true;
    }
    return this.rawTweets;
  };

  return SampleProcessor;

})();

module.exports = SampleProcessor;


},{}],"/Users/neilcarpenter/Sites/twitter-doodles/project/worker/tweets/TweetsProcessor.coffee":[function(require,module,exports){
var TweetsProcessor,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TweetsProcessor = (function() {
  function TweetsProcessor() {
    this.process = __bind(this.process, this);
  }

  TweetsProcessor.prototype.rawTweets = null;

  TweetsProcessor.prototype.process = function(rawTweets) {
    var tweet, _i, _len, _ref;
    this.rawTweets = rawTweets;
    _ref = this.rawTweets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tweet = _ref[_i];
      tweet.TW_PROCESSED = true;
    }
    return this.rawTweets;
  };

  return TweetsProcessor;

})();

module.exports = TweetsProcessor;


},{}]},{},["/Users/neilcarpenter/Sites/twitter-doodles/project/worker/Main.coffee"])
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/App.coffee":[function(require,module,exports){
var Analytics, App, AppData, AppView, AuthManager, Facebook, GooglePlus, Locale, Nav, Router, Share, Templates,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Analytics = require('./utils/Analytics');

AuthManager = require('./utils/AuthManager');

Share = require('./utils/Share');

Facebook = require('./utils/Facebook');

GooglePlus = require('./utils/GooglePlus');

Templates = require('./data/Templates');

Locale = require('./data/Locale');

Router = require('./router/Router');

Nav = require('./router/Nav');

AppData = require('./AppData');

AppView = require('./AppView');

App = (function() {
  App.prototype.LIVE = null;

  App.prototype.BASE_PATH = window.config.hostname;

  App.prototype.localeCode = window.config.localeCode;

  App.prototype.objReady = 0;

  App.prototype._toClean = ['objReady', 'setFlags', 'objectComplete', 'init', 'initObjects', 'initSDKs', 'initApp', 'go', 'cleanup', '_toClean'];

  function App(LIVE) {
    this.LIVE = LIVE;
    this.cleanup = __bind(this.cleanup, this);
    this.go = __bind(this.go, this);
    this.initApp = __bind(this.initApp, this);
    this.initSDKs = __bind(this.initSDKs, this);
    this.initObjects = __bind(this.initObjects, this);
    this.init = __bind(this.init, this);
    this.objectComplete = __bind(this.objectComplete, this);
    this.setFlags = __bind(this.setFlags, this);
    return null;
  }

  App.prototype.setFlags = function() {
    var ua;
    ua = window.navigator.userAgent.toLowerCase();
    this.IS_ANDROID = ua.indexOf('android') > -1;
    this.IS_FIREFOX = ua.indexOf('firefox') > -1;
    this.IS_CHROME_IOS = ua.match('crios') ? true : false;
    return null;
  };

  App.prototype.objectComplete = function() {
    this.objReady++;
    if (this.objReady >= 4) {
      this.initApp();
    }
    return null;
  };

  App.prototype.init = function() {
    this.initObjects();
    return null;
  };

  App.prototype.initObjects = function() {
    this.templates = new Templates("/data/templates" + (this.LIVE ? '.min' : '') + ".xml", this.objectComplete);
    this.locale = new Locale("/data/locales/strings.json", this.objectComplete);
    this.analytics = new Analytics("/data/tracking.json", this.objectComplete);
    this.appData = new AppData(this.objectComplete);
    return null;
  };

  App.prototype.initSDKs = function() {
    Facebook.load();
    GooglePlus.load();
    return null;
  };

  App.prototype.initApp = function() {
    this.setFlags();

    /* Starts application */
    this.appView = new AppView;
    this.router = new Router;
    this.nav = new Nav;
    this.auth = new AuthManager;
    this.share = new Share;
    this.go();
    this.initSDKs();
    return null;
  };

  App.prototype.go = function() {

    /* After everything is loaded, kicks off website */
    this.appView.render();

    /* remove redundant initialisation methods / properties */
    this.cleanup();
    return null;
  };

  App.prototype.cleanup = function() {
    var fn, _i, _len, _ref;
    _ref = this._toClean;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      fn = _ref[_i];
      this[fn] = null;
      delete this[fn];
    }
    return null;
  };

  return App;

})();

module.exports = App;


},{"./AppData":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/AppData.coffee","./AppView":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/AppView.coffee","./data/Locale":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/Locale.coffee","./data/Templates":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/Templates.coffee","./router/Nav":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/router/Nav.coffee","./router/Router":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/router/Router.coffee","./utils/Analytics":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/utils/Analytics.coffee","./utils/AuthManager":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/utils/AuthManager.coffee","./utils/Facebook":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/utils/Facebook.coffee","./utils/GooglePlus":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/utils/GooglePlus.coffee","./utils/Share":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/utils/Share.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/AppData.coffee":[function(require,module,exports){
var API, AbstractData, AppData, Requester, TweetCruncher, UserData,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractData = require('./data/AbstractData');

UserData = require('./data/UserData');

Requester = require('./utils/Requester');

API = require('./data/API');

TweetCruncher = require('./data/TweetCruncher');

AppData = (function(_super) {
  __extends(AppData, _super);

  AppData.prototype.callback = null;

  function AppData(callback) {
    this.callback = callback;
    this.onStartDataReceived = __bind(this.onStartDataReceived, this);
    this.getStartData = __bind(this.getStartData, this);
    this.user = new UserData;
    this.cruncher = new TweetCruncher;
    AppData.__super__.constructor.call(this);
    if (typeof this.callback === "function") {
      this.callback();
    }
    return null;
  }


  /*
  	get app bootstrap data - embed in HTML or API endpoint
   */

  AppData.prototype.getStartData = function() {
    var r;
    r = Requester.request({
      url: API.get('start'),
      type: 'GET'
    });
    r.done(this.onStartDataReceived);
    r.fail((function(_this) {
      return function() {

        /*
        			this is only temporary, while there is no bootstrap data here, normally would handle error / fail
         */
        return typeof _this.callback === "function" ? _this.callback() : void 0;
      };
    })(this));
    return null;
  };

  AppData.prototype.onStartDataReceived = function(data) {

    /*
    
    		bootstrap data received, app ready to go
     */
    if (typeof this.callback === "function") {
      this.callback();
    }
    return null;
  };

  return AppData;

})(AbstractData);

module.exports = AppData;


},{"./data/API":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/API.coffee","./data/AbstractData":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/AbstractData.coffee","./data/TweetCruncher":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/TweetCruncher.coffee","./data/UserData":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/UserData.coffee","./utils/Requester":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/utils/Requester.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/AppView.coffee":[function(require,module,exports){
var AbstractView, AppView, Footer, Header, ModalManager, Preloader, Wrapper,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('./view/AbstractView');

Preloader = require('./view/base/Preloader');

Header = require('./view/base/Header');

Wrapper = require('./view/base/Wrapper');

Footer = require('./view/base/Footer');

ModalManager = require('./view/modals/_ModalManager');

AppView = (function(_super) {
  __extends(AppView, _super);

  AppView.prototype.template = 'main';

  AppView.prototype.$window = null;

  AppView.prototype.$body = null;

  AppView.prototype.wrapper = null;

  AppView.prototype.footer = null;

  AppView.prototype.dims = {
    w: null,
    h: null,
    o: null,
    c: null
  };

  AppView.prototype.events = {
    'click a': 'linkManager'
  };

  AppView.prototype.EVENT_UPDATE_DIMENSIONS = 'EVENT_UPDATE_DIMENSIONS';

  AppView.prototype.MOBILE_WIDTH = 700;

  AppView.prototype.MOBILE = 'mobile';

  AppView.prototype.NON_MOBILE = 'non_mobile';

  function AppView() {
    this.handleExternalLink = __bind(this.handleExternalLink, this);
    this.navigateToUrl = __bind(this.navigateToUrl, this);
    this.linkManager = __bind(this.linkManager, this);
    this.getDims = __bind(this.getDims, this);
    this.onResize = __bind(this.onResize, this);
    this.begin = __bind(this.begin, this);
    this.onAllRendered = __bind(this.onAllRendered, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.render = __bind(this.render, this);
    this.enableTouch = __bind(this.enableTouch, this);
    this.disableTouch = __bind(this.disableTouch, this);
    this.$window = $(window);
    this.$body = $('body').eq(0);
    AppView.__super__.constructor.call(this);
    return null;
  }

  AppView.prototype.disableTouch = function() {
    this.$window.on('touchmove', this.onTouchMove);
    return null;
  };

  AppView.prototype.enableTouch = function() {
    this.$window.off('touchmove', this.onTouchMove);
    return null;
  };

  AppView.prototype.onTouchMove = function(e) {
    e.preventDefault();
    return null;
  };

  AppView.prototype.render = function() {
    this.bindEvents();
    this.preloader = new Preloader;
    this.modalManager = new ModalManager;
    this.header = new Header;
    this.wrapper = new Wrapper;
    this.footer = new Footer;
    this.addChild(this.header).addChild(this.wrapper).addChild(this.footer);
    this.onAllRendered();
    return null;
  };

  AppView.prototype.bindEvents = function() {
    this.on('allRendered', this.onAllRendered);
    this.onResize();
    this.onResize = _.debounce(this.onResize, 300);
    this.$window.on('resize orientationchange', this.onResize);
    return null;
  };

  AppView.prototype.onAllRendered = function() {
    this.$body.prepend(this.$el);
    this.begin();
    return null;
  };

  AppView.prototype.begin = function() {
    this.trigger('start');
    this.TD().router.start();
    this.preloader.hide();
    return null;
  };

  AppView.prototype.onResize = function() {
    this.getDims();
    return null;
  };

  AppView.prototype.getDims = function() {
    var h, w;
    w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    this.dims = {
      w: w,
      h: h,
      o: h > w ? 'portrait' : 'landscape',
      c: w <= this.MOBILE_WIDTH ? this.MOBILE : this.NON_MOBILE
    };
    this.trigger(this.EVENT_UPDATE_DIMENSIONS, this.dims);
    return null;
  };

  AppView.prototype.linkManager = function(e) {
    var href;
    href = $(e.currentTarget).attr('href');
    if (!href) {
      return false;
    }
    this.navigateToUrl(href, e);
    return null;
  };

  AppView.prototype.navigateToUrl = function(href, e) {
    var route, section;
    if (e == null) {
      e = null;
    }
    route = href.match(this.TD().BASE_PATH) ? href.split(this.TD().BASE_PATH)[1] : href;
    section = route.indexOf('/') === 0 ? route.split('/')[1] : route;
    if (this.TD().nav.getSection(section)) {
      if (e != null) {
        e.preventDefault();
      }
      this.TD().router.navigateTo(route);
    } else {
      this.handleExternalLink(href);
    }
    return null;
  };

  AppView.prototype.handleExternalLink = function(data) {

    /*
    
    		bind tracking events if necessary
     */
    return null;
  };

  return AppView;

})(AbstractView);

module.exports = AppView;


},{"./view/AbstractView":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/AbstractView.coffee","./view/base/Footer":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/base/Footer.coffee","./view/base/Header":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/base/Header.coffee","./view/base/Preloader":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/base/Preloader.coffee","./view/base/Wrapper":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/base/Wrapper.coffee","./view/modals/_ModalManager":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/modals/_ModalManager.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/Main.coffee":[function(require,module,exports){
var App, IS_LIVE, view;

App = require('./App');


/*

WIP - this will ideally change to old format (above) when can figure it out
 */

IS_LIVE = false;

view = IS_LIVE ? {} : window || document;

view.TD = new App(IS_LIVE);

view.TD.init();


},{"./App":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/App.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/collections/AbstractCollection.coffee":[function(require,module,exports){
var AbstractCollection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractCollection = (function(_super) {
  __extends(AbstractCollection, _super);

  function AbstractCollection() {
    this.TD = __bind(this.TD, this);
    return AbstractCollection.__super__.constructor.apply(this, arguments);
  }

  AbstractCollection.prototype.TD = function() {
    return window.TD;
  };

  return AbstractCollection;

})(Backbone.Collection);

module.exports = AbstractCollection;


},{}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/collections/core/TemplatesCollection.coffee":[function(require,module,exports){
var TemplateModel, TemplatesCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TemplateModel = require('../../models/core/TemplateModel');

TemplatesCollection = (function(_super) {
  __extends(TemplatesCollection, _super);

  function TemplatesCollection() {
    return TemplatesCollection.__super__.constructor.apply(this, arguments);
  }

  TemplatesCollection.prototype.model = TemplateModel;

  return TemplatesCollection;

})(Backbone.Collection);

module.exports = TemplatesCollection;


},{"../../models/core/TemplateModel":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/core/TemplateModel.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/collections/tweets/ProcessedTweetsCollection.coffee":[function(require,module,exports){
var AbstractCollection, ProcessedTweetsCollection, ProcessedTweetsModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractCollection = require('../AbstractCollection');

ProcessedTweetsModel = require('../../models/tweets/ProcessedTweetsModel');

ProcessedTweetsCollection = (function(_super) {
  __extends(ProcessedTweetsCollection, _super);

  function ProcessedTweetsCollection() {
    return ProcessedTweetsCollection.__super__.constructor.apply(this, arguments);
  }

  ProcessedTweetsCollection.prototype.model = ProcessedTweetsModel;

  return ProcessedTweetsCollection;

})(AbstractCollection);

module.exports = ProcessedTweetsCollection;


},{"../../models/tweets/ProcessedTweetsModel":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/tweets/ProcessedTweetsModel.coffee","../AbstractCollection":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/collections/AbstractCollection.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/collections/tweets/RawTweetsCollection.coffee":[function(require,module,exports){
var AbstractCollection, RawTweetModel, RawTweetsCollection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractCollection = require('../AbstractCollection');

RawTweetModel = require('../../models/tweets/RawTweetModel');

RawTweetsCollection = (function(_super) {
  __extends(RawTweetsCollection, _super);

  function RawTweetsCollection() {
    return RawTweetsCollection.__super__.constructor.apply(this, arguments);
  }

  RawTweetsCollection.prototype.model = RawTweetModel;

  return RawTweetsCollection;

})(AbstractCollection);

module.exports = RawTweetsCollection;


},{"../../models/tweets/RawTweetModel":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/tweets/RawTweetModel.coffee","../AbstractCollection":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/collections/AbstractCollection.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/API.coffee":[function(require,module,exports){
var API, APIRouteModel;

APIRouteModel = require('../models/core/APIRouteModel');

API = (function() {
  function API() {}

  API.model = new APIRouteModel;

  API.getContants = function() {
    return {

      /* add more if we wanna use in API strings */
      BASE_PATH: API.TD().BASE_PATH
    };
  };

  API.get = function(name, vars) {
    vars = $.extend(true, vars, API.getContants());
    return API.supplantString(API.model.get(name), vars);
  };

  API.supplantString = function(str, vals) {
    return str.replace(/{{ ([^{}]*) }}/g, function(a, b) {
      var r;
      return r = vals[b] || (typeof vals[b] === 'number' ? vals[b].toString() : '');
    });
    if (typeof r === "string" || typeof r === "number") {
      return r;
    } else {
      return a;
    }
  };

  API.TD = function() {
    return window.TD;
  };

  return API;

})();

module.exports = API;


},{"../models/core/APIRouteModel":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/core/APIRouteModel.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/AbstractData.coffee":[function(require,module,exports){
var AbstractData,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

AbstractData = (function() {
  function AbstractData() {
    this.TD = __bind(this.TD, this);
    _.extend(this, Backbone.Events);
    return null;
  }

  AbstractData.prototype.TD = function() {
    return window.TD;
  };

  return AbstractData;

})();

module.exports = AbstractData;


},{}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/Locale.coffee":[function(require,module,exports){
var API, Locale, LocalesModel,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

LocalesModel = require('../models/core/LocalesModel');

API = require('../data/API');


/*
 * Locale Loader #

Fires back an event when complete
 */

Locale = (function() {
  Locale.prototype.lang = null;

  Locale.prototype.data = null;

  Locale.prototype.callback = null;

  Locale.prototype.backup = null;

  Locale.prototype["default"] = 'en-gb';

  function Locale(data, cb) {
    this.getLocaleImage = __bind(this.getLocaleImage, this);
    this.get = __bind(this.get, this);
    this.loadBackup = __bind(this.loadBackup, this);
    this.onSuccess = __bind(this.onSuccess, this);
    this.getLang = __bind(this.getLang, this);

    /* start Locale Loader, define locale based on browser language */
    this.callback = cb;
    this.backup = data;
    this.loadBackup();
    null;
  }

  Locale.prototype.getLang = function() {
    var lang;
    if (window.location.search && window.location.search.match('lang=')) {
      lang = window.location.search.split('lang=')[1].split('&')[0];
    } else if (window.config.localeCode) {
      lang = window.config.localeCode;
    } else {
      lang = this["default"];
    }
    return lang;
  };

  Locale.prototype.onSuccess = function(event) {

    /* Fires back an event once it's complete */
    var d;
    d = null;
    if (event.responseText) {
      d = JSON.parse(event.responseText);
    } else {
      d = event;
    }
    this.data = new LocalesModel(d);
    if (typeof this.callback === "function") {
      this.callback();
    }
    return null;
  };

  Locale.prototype.loadBackup = function() {

    /* When API not available, tries to load the static .txt locale */
    $.ajax({
      url: this.backup,
      dataType: 'json',
      complete: this.onSuccess,
      error: (function(_this) {
        return function() {
          return console.log('error on loading backup');
        };
      })(this)
    });
    return null;
  };

  Locale.prototype.get = function(id) {

    /* get String from locale
    + id : string id of the Localised String
     */
    return this.data.getString(id);
  };

  Locale.prototype.getLocaleImage = function(url) {
    return window.config.CDN + "/images/locale/" + window.config.localeCode + "/" + url;
  };

  return Locale;

})();

module.exports = Locale;


},{"../data/API":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/API.coffee","../models/core/LocalesModel":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/core/LocalesModel.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/Templates.coffee":[function(require,module,exports){
var TemplateModel, Templates, TemplatesCollection,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TemplateModel = require('../models/core/TemplateModel');

TemplatesCollection = require('../collections/core/TemplatesCollection');

Templates = (function() {
  Templates.prototype.templates = null;

  Templates.prototype.cb = null;

  function Templates(templates, callback) {
    this.get = __bind(this.get, this);
    this.parseXML = __bind(this.parseXML, this);
    this.cb = callback;
    $.ajax({
      url: templates,
      success: this.parseXML
    });
    null;
  }

  Templates.prototype.parseXML = function(data) {
    var temp;
    temp = [];
    $(data).find('template').each(function(key, value) {
      var $value;
      $value = $(value);
      return temp.push(new TemplateModel({
        id: $value.attr('id').toString(),
        text: $.trim($value.text())
      }));
    });
    this.templates = new TemplatesCollection(temp);
    if (typeof this.cb === "function") {
      this.cb();
    }
    return null;
  };

  Templates.prototype.get = function(id) {
    var t;
    t = this.templates.where({
      id: id
    });
    t = t[0].get('text');
    return $.trim(t);
  };

  return Templates;

})();

module.exports = Templates;


},{"../collections/core/TemplatesCollection":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/collections/core/TemplatesCollection.coffee","../models/core/TemplateModel":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/core/TemplateModel.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/TweetCruncher.coffee":[function(require,module,exports){
var AbstractData, TweetCruncher,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractData = require('./AbstractData');

TweetCruncher = (function(_super) {
  __extends(TweetCruncher, _super);

  TweetCruncher.prototype.worker = null;

  TweetCruncher.prototype.task_counter = 0;

  TweetCruncher.prototype.dfds = {};

  TweetCruncher.prototype.buffer = [];

  TweetCruncher.prototype.inProgress = false;

  TweetCruncher.prototype.ENV = window.config.LIVE ? 'production' : 'dev';

  TweetCruncher.prototype.DEPENDENCIES = {};

  function TweetCruncher() {
    this.onError = __bind(this.onError, this);
    this.onResult = __bind(this.onResult, this);
    this.crunch = __bind(this.crunch, this);
    this._processBuffer = __bind(this._processBuffer, this);
    this._addToBuffer = __bind(this._addToBuffer, this);
    this.loadDependencies = __bind(this.loadDependencies, this);
    this.setEnvironment = __bind(this.setEnvironment, this);
    this.setupEvents = __bind(this.setupEvents, this);
    this.setupMessaging = __bind(this.setupMessaging, this);
    this.setup = __bind(this.setup, this);
    TweetCruncher.__super__.constructor.call(this);
    this.worker = new Worker("" + (this.TD().BASE_PATH) + window.config.worker.url);
    this.setup();
    return null;
  }

  TweetCruncher.prototype.setup = function() {
    this.setEnvironment();
    this.loadDependencies();
    this.setupMessaging();
    this.setupEvents();
    return null;
  };

  TweetCruncher.prototype.setupMessaging = function() {
    this.worker.onmessage = (function(_this) {
      return function(event) {
        switch (event.data.type) {
          case "console":
            return console[event.data.action](event.data.msg);
          case "result":
            return _this.trigger('result', {
              method: event.data.method,
              result: JSON.parse(event.data.data)
            });
          case "error":
            return _this.trigger('error', {
              code: event.data.code,
              result: JSON.parse(event.data.data)
            });
          default:
            return console.log('unknown event - ', event);
        }
      };
    })(this);
    return null;
  };

  TweetCruncher.prototype.setupEvents = function() {
    this.on('result', this.onResult);
    this.on('error', this.onError);
    return null;
  };

  TweetCruncher.prototype.setEnvironment = function() {
    this.worker.postMessage({
      type: 'setEnvironment',
      data: this.ENV
    });
    return null;
  };

  TweetCruncher.prototype.loadDependencies = function() {
    var name, url, _ref;
    _ref = this.DEPENDENCIES;
    for (name in _ref) {
      url = _ref[name];
      this.worker.postMessage({
        type: 'loadDependency',
        data: url
      });
    }
    return null;
  };

  TweetCruncher.prototype._addToBuffer = function(data) {
    this.buffer.push(data);
    this._processBuffer();
    this.inProgress = true;
    return null;
  };

  TweetCruncher.prototype._processBuffer = function() {
    var args;
    if (!(!this.inProgress && this.buffer.length)) {
      return;
    }
    args = this.buffer.shift();
    console.log("[worker] SEND ", JSON.parse(args.data).task_id);
    this.worker.postMessage(args);
    return null;
  };


  /*
  	/
  	/ Process all tweets
  	/ @param data = { tweets : [tweets] }
  	/
   */

  TweetCruncher.prototype.crunch = function(data) {
    data.task_id = this.task_counter++;
    data.timestamp = Date.now();
    console.log("crunch: (data) => task_id = ", data.task_id);
    this._addToBuffer({
      type: 'processTweets',
      data: JSON.stringify(data)
    });
    return this.dfds[data.task_id] = $.Deferred();
  };

  TweetCruncher.prototype.onResult = function(data) {
    var time, _ref;
    time = Date.now() - data.result.timestamp;
    console.log("Complete method " + data.method + " - task_id = ", data.result.task_id, data.result);
    console.log("[worker] RECEIVE in " + time + "ms -- ", data.result.task_id);
    if ((_ref = this.dfds[data.result.task_id]) != null) {
      _ref.resolve(data.result);
    }
    this.dfds[data.result.task_id] = null;
    delete this.dfds[data.result.task_id];
    this.inProgress = false;
    this._processBuffer();
    return null;
  };


  /*
  	/
  	/ Error handling
  	/
  	/
   */

  TweetCruncher.prototype.onError = function(data) {
    var _ref;
    console.error("Error on crunch - ID = ", data.result.task_id, data);
    if ((_ref = this.dfds[data.result.task_id]) != null) {
      _ref.reject(data.code);
    }
    this.dfds[data.result.task_id] = null;
    delete this.dfds[data.result.task_id];
    return null;
  };

  return TweetCruncher;

})(AbstractData);

module.exports = TweetCruncher;


},{"./AbstractData":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/AbstractData.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/UserData.coffee":[function(require,module,exports){
var API, AbstractData, ProcessedTweetsCollection, ProcessedTweetsSampleModel, RawTweetsCollection, Requester, UserData, UserInfoModel, UserStatusModel,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractData = require('./AbstractData');

Requester = require('../utils/Requester');

API = require('./API');

UserStatusModel = require('../models/core/UserStatusModel');

UserInfoModel = require('../models/core/UserInfoModel');

RawTweetsCollection = require('../collections/tweets/RawTweetsCollection');

ProcessedTweetsCollection = require('../collections/tweets/ProcessedTweetsCollection');

ProcessedTweetsSampleModel = require('../models/tweets/ProcessedTweetsSampleModel');

UserData = (function(_super) {
  __extends(UserData, _super);

  UserData.prototype.status = null;

  UserData.prototype.info = null;

  UserData.prototype.EVENT_USER_LOGGED = 'EVENT_USER_LOGGED';

  function UserData() {
    this.onLogoutDone = __bind(this.onLogoutDone, this);
    this.removeUser = __bind(this.removeUser, this);
    this.logout = __bind(this.logout, this);
    this.getTweetsFail = __bind(this.getTweetsFail, this);
    this.getTweetsSuccess = __bind(this.getTweetsSuccess, this);
    this.getTweets = __bind(this.getTweets, this);
    this.loginFail = __bind(this.loginFail, this);
    this.loginSuccess = __bind(this.loginSuccess, this);
    this.setupLogin = __bind(this.setupLogin, this);
    this.login = __bind(this.login, this);
    this.onLoggedChange = __bind(this.onLoggedChange, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.status = new UserStatusModel;
    this.info = new UserInfoModel;
    this.tweetsRaw = new RawTweetsCollection;
    this.tweetsData = new ProcessedTweetsCollection;
    this.tweetsSample = new ProcessedTweetsSampleModel;
    UserData.__super__.constructor.call(this);
    this.bindEvents();
    return null;
  }

  UserData.prototype.bindEvents = function() {
    this.status.on('change:logged', this.onLoggedChange);
    this.on(this.EVENT_USER_LOGGED, this.getTweets);
    return null;
  };

  UserData.prototype.onLoggedChange = function() {
    if (this.status.get('logged')) {
      this.trigger(this.EVENT_USER_LOGGED);
    }
    return null;
  };

  UserData.prototype.login = function(data) {
    var h, left, opts, top, url, w;
    return this.getTweets();
    this.setupLogin();
    url = '/auth/twitter';
    w = 680;
    h = 540;
    left = (screen.availWidth - w) >> 1;
    top = (screen.availHeight - h) >> 1;
    opts = 'width=' + w + ',height=' + h + ',top=' + top + ',left=' + left + ',location=0,menubar=0,scrollbars=0,status=0,toolbar=0,resizable=0';
    window._loginWindow = window.open(url, 'loginWindow', opts);
    return null;
  };

  UserData.prototype.setupLogin = function() {
    window.$loginDfd = $.Deferred();
    window.$loginDfd.done(this.loginSuccess);
    window.$loginDfd.fail(function() {
      return this.loginFail;
    });
    return null;
  };

  UserData.prototype.loginSuccess = function(data) {
    console.log("login successful -->", data);
    this.info.set(data);
    window._loginWindow.close();
    this.status.set('logged', true);
    return null;
  };

  UserData.prototype.loginFail = function(res) {
    console.log("failed to log in... -->", res);
    return null;
  };

  UserData.prototype.getTweets = function() {
    var data, r;
    data = {
      user_id: this.info.get('id'),
      token: this.info.get('token'),
      tokenSecret: this.info.get('tokenSecret')
    };
    r = Requester.request({
      url: API.get('getTweets'),
      type: "POST",
      data: data
    });
    r.done(this.getTweetsSuccess);
    r.fail(this.getTweetsFail);
    return r;
  };

  UserData.prototype.getTweetsSuccess = function(data) {
    var crunch;
    this.tweetsRaw.add(data.tweets);
    crunch = this.TD().appData.cruncher.crunch({
      tweets: data.tweets
    });
    crunch.done((function(_this) {
      return function(data) {
        _this.tweetsData.add(data.tweetsData);
        return _this.tweetsSample.set(data.tweetsSample);
      };
    })(this));
    return null;
  };

  UserData.prototype.getTweetsFail = function(data) {
    console.error("failed getting user tweets... ->", data);
    return null;
  };

  UserData.prototype.logout = function(removeUser) {
    var endpoint, r;
    if (removeUser == null) {
      removeUser = false;
    }
    endpoint = removeUser ? API.get('user.remove') : API.get('user.logout');
    r = Requester.request({
      url: endpoint,
      type: "POST"
    });
    r.done(this.onLogoutDone);
    return null;
  };

  UserData.prototype.removeUser = function() {
    this.logout(true);
    return null;
  };

  UserData.prototype.onLogoutDone = function() {
    window.location.href = this.TD().BASE_PATH;
    return null;
  };

  return UserData;

})(AbstractData);

module.exports = UserData;


},{"../collections/tweets/ProcessedTweetsCollection":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/collections/tweets/ProcessedTweetsCollection.coffee","../collections/tweets/RawTweetsCollection":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/collections/tweets/RawTweetsCollection.coffee","../models/core/UserInfoModel":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/core/UserInfoModel.coffee","../models/core/UserStatusModel":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/core/UserStatusModel.coffee","../models/tweets/ProcessedTweetsSampleModel":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/tweets/ProcessedTweetsSampleModel.coffee","../utils/Requester":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/utils/Requester.coffee","./API":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/API.coffee","./AbstractData":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/AbstractData.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/AbstractModel.coffee":[function(require,module,exports){
var AbstractModel,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractModel = (function(_super) {
  __extends(AbstractModel, _super);

  function AbstractModel(attrs, option) {
    this.TD = __bind(this.TD, this);
    this._filterAttrs = __bind(this._filterAttrs, this);
    attrs = this._filterAttrs(attrs);
    return Backbone.DeepModel.apply(this, arguments);
  }

  AbstractModel.prototype.set = function(attrs, options) {
    options || (options = {});
    attrs = this._filterAttrs(attrs);
    options.data = JSON.stringify(attrs);
    return Backbone.DeepModel.prototype.set.call(this, attrs, options);
  };

  AbstractModel.prototype._filterAttrs = function(attrs) {
    return attrs;
  };

  AbstractModel.prototype.TD = function() {
    return window.TD;
  };

  return AbstractModel;

})(Backbone.DeepModel);

module.exports = AbstractModel;


},{}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/core/APIRouteModel.coffee":[function(require,module,exports){
var APIRouteModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

APIRouteModel = (function(_super) {
  __extends(APIRouteModel, _super);

  function APIRouteModel() {
    return APIRouteModel.__super__.constructor.apply(this, arguments);
  }

  APIRouteModel.prototype.defaults = {
    start: "{{ BASE_PATH }}/api/start",
    locale: "{{ BASE_PATH }}/api/l10n/{{ code }}",
    getTweets: "{{ BASE_PATH }}/api/twitter/getTweets"
  };

  return APIRouteModel;

})(Backbone.DeepModel);

module.exports = APIRouteModel;


},{}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/core/LocalesModel.coffee":[function(require,module,exports){
var LocalesModel,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

LocalesModel = (function(_super) {
  __extends(LocalesModel, _super);

  function LocalesModel() {
    this.getString = __bind(this.getString, this);
    this.get_language = __bind(this.get_language, this);
    return LocalesModel.__super__.constructor.apply(this, arguments);
  }

  LocalesModel.prototype.defaults = {
    code: null,
    language: null,
    strings: null
  };

  LocalesModel.prototype.get_language = function() {
    return this.get('language');
  };

  LocalesModel.prototype.getString = function(id) {
    var a, e, k, v, _ref, _ref1;
    _ref = this.get('strings');
    for (k in _ref) {
      v = _ref[k];
      _ref1 = v['strings'];
      for (a in _ref1) {
        e = _ref1[a];
        if (a === id) {
          return e;
        }
      }
    }
    console.warn("Locales -> not found string: " + id);
    return null;
  };

  return LocalesModel;

})(Backbone.Model);

module.exports = LocalesModel;


},{}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/core/TemplateModel.coffee":[function(require,module,exports){
var TemplateModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TemplateModel = (function(_super) {
  __extends(TemplateModel, _super);

  function TemplateModel() {
    return TemplateModel.__super__.constructor.apply(this, arguments);
  }

  TemplateModel.prototype.defaults = {
    id: "",
    text: ""
  };

  return TemplateModel;

})(Backbone.Model);

module.exports = TemplateModel;


},{}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/core/UserInfoModel.coffee":[function(require,module,exports){
var AbstractModel, UserInfoModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractModel = require('../AbstractModel');

UserInfoModel = (function(_super) {
  __extends(UserInfoModel, _super);

  function UserInfoModel() {
    return UserInfoModel.__super__.constructor.apply(this, arguments);
  }

  UserInfoModel.prototype.defaults = {
    token: "",
    tokenSecret: "",
    name: "",
    id: ""
  };

  return UserInfoModel;

})(AbstractModel);

module.exports = UserInfoModel;


},{"../AbstractModel":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/AbstractModel.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/core/UserStatusModel.coffee":[function(require,module,exports){
var AbstractModel, UserStatusModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractModel = require('../AbstractModel');

UserStatusModel = (function(_super) {
  __extends(UserStatusModel, _super);

  function UserStatusModel() {
    return UserStatusModel.__super__.constructor.apply(this, arguments);
  }

  UserStatusModel.prototype.defaults = {
    logged: false
  };

  return UserStatusModel;

})(AbstractModel);

module.exports = UserStatusModel;


},{"../AbstractModel":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/AbstractModel.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/tweets/ProcessedTweetsModel.coffee":[function(require,module,exports){
var AbstractModel, ProcessedTweetsModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractModel = require('../AbstractModel');

ProcessedTweetsModel = (function(_super) {
  __extends(ProcessedTweetsModel, _super);

  function ProcessedTweetsModel() {
    return ProcessedTweetsModel.__super__.constructor.apply(this, arguments);
  }

  ProcessedTweetsModel.prototype.defaults = {
    id_str: "",
    chars: "",
    words: "",
    mentions: [],
    hashtags: [],
    media: [],
    retweets: "",
    favourites: "",
    created_at: ""
  };

  return ProcessedTweetsModel;

})(AbstractModel);

module.exports = ProcessedTweetsModel;


},{"../AbstractModel":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/AbstractModel.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/tweets/ProcessedTweetsSampleModel.coffee":[function(require,module,exports){
var AbstractModel, ProcessedTweetsSampleModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractModel = require('../AbstractModel');


/*
	
format for X

> ARRAY - {{ X }} used in chronological order
chrono : ""

> ARRAYs - {{ X }} used and their frequency, sorted alphabetically / by frequency
counted :
	alpha : ""
	count : ""
 */

ProcessedTweetsSampleModel = (function(_super) {
  __extends(ProcessedTweetsSampleModel, _super);

  function ProcessedTweetsSampleModel() {
    return ProcessedTweetsSampleModel.__super__.constructor.apply(this, arguments);
  }

  ProcessedTweetsSampleModel.prototype.chars = {
    chrono: "",
    counted: {
      alpha: "",
      count: ""
    }
  };

  ProcessedTweetsSampleModel.prototype.words = {
    chrono: "",
    counted: {
      alpha: "",
      count: ""
    }
  };

  ProcessedTweetsSampleModel.prototype.hashtags = {
    chrono: "",
    counted: {
      alpha: "",
      count: ""
    }
  };

  ProcessedTweetsSampleModel.prototype.mentions = {
    chrono: "",
    counted: {
      alpha: "",
      count: ""
    }
  };

  ProcessedTweetsSampleModel.prototype.sources = {
    chrono: "",
    counted: {
      alpha: "",
      count: ""
    }
  };

  ProcessedTweetsSampleModel.prototype.linkHosts = {
    chrono: "",
    counted: {
      alpha: "",
      count: ""
    }
  };

  ProcessedTweetsSampleModel.prototype.places = {
    chrono: "",
    counted: {
      alpha: "",
      count: ""
    }
  };

  return ProcessedTweetsSampleModel;

})(AbstractModel);

module.exports = ProcessedTweetsSampleModel;


},{"../AbstractModel":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/AbstractModel.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/tweets/RawTweetModel.coffee":[function(require,module,exports){
var AbstractModel, RawTweetModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractModel = require('../AbstractModel');

RawTweetModel = (function(_super) {
  __extends(RawTweetModel, _super);

  function RawTweetModel() {
    return RawTweetModel.__super__.constructor.apply(this, arguments);
  }

  RawTweetModel.prototype.defaults = "";

  return RawTweetModel;

})(AbstractModel);

module.exports = RawTweetModel;


},{"../AbstractModel":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/models/AbstractModel.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/router/Nav.coffee":[function(require,module,exports){
var AbstractView, Nav, Router,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../view/AbstractView');

Router = require('./Router');

Nav = (function(_super) {
  __extends(Nav, _super);

  Nav.EVENT_CHANGE_VIEW = 'EVENT_CHANGE_VIEW';

  Nav.EVENT_CHANGE_SUB_VIEW = 'EVENT_CHANGE_SUB_VIEW';

  Nav.prototype.sections = {
    HOME: '',
    EXAMPLE: 'example'
  };

  Nav.prototype.current = {
    area: null,
    sub: null
  };

  Nav.prototype.previous = {
    area: null,
    sub: null
  };

  function Nav() {
    this.setPageTitle = __bind(this.setPageTitle, this);
    this.changeView = __bind(this.changeView, this);
    this.getSection = __bind(this.getSection, this);
    this.TD().router.on(Router.EVENT_HASH_CHANGED, this.changeView);
    return false;
  }

  Nav.prototype.getSection = function(section) {
    var sectionName, uri, _ref;
    if (section === '') {
      return true;
    }
    _ref = this.sections;
    for (sectionName in _ref) {
      uri = _ref[sectionName];
      if (uri === section) {
        return sectionName;
      }
    }
    return false;
  };

  Nav.prototype.changeView = function(area, sub, params) {
    this.previous = this.current;
    this.current = {
      area: area,
      sub: sub
    };
    if (this.previous.area && this.previous.area === this.current.area) {
      this.trigger(Nav.EVENT_CHANGE_SUB_VIEW, this.current);
    } else {
      this.trigger(Nav.EVENT_CHANGE_VIEW, this.previous, this.current);
      this.trigger(Nav.EVENT_CHANGE_SUB_VIEW, this.current);
    }
    if (this.TD().appView.modalManager.isOpen()) {
      this.TD().appView.modalManager.hideOpenModal();
    }
    this.setPageTitle(area, sub);
    return null;
  };

  Nav.prototype.setPageTitle = function(area, sub) {
    var title;
    title = "PAGE TITLE HERE - LOCALISE BASED ON URL";
    if (window.document.title !== title) {
      window.document.title = title;
    }
    return null;
  };

  return Nav;

})(AbstractView);

module.exports = Nav;


},{"../view/AbstractView":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/AbstractView.coffee","./Router":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/router/Router.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/router/Router.coffee":[function(require,module,exports){
var Router,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    this.TD = __bind(this.TD, this);
    this.navigateTo = __bind(this.navigateTo, this);
    this.hashChanged = __bind(this.hashChanged, this);
    this.start = __bind(this.start, this);
    return Router.__super__.constructor.apply(this, arguments);
  }

  Router.EVENT_HASH_CHANGED = 'EVENT_HASH_CHANGED';

  Router.prototype.FIRST_ROUTE = true;

  Router.prototype.routes = {
    '(/)(:area)(/:sub)(/)': 'hashChanged',
    '*actions': 'navigateTo'
  };

  Router.prototype.area = null;

  Router.prototype.sub = null;

  Router.prototype.params = null;

  Router.prototype.start = function() {
    Backbone.history.start({
      pushState: true,
      root: '/'
    });
    return null;
  };

  Router.prototype.hashChanged = function(area, sub) {
    this.area = area != null ? area : null;
    this.sub = sub != null ? sub : null;
    console.log(">> EVENT_HASH_CHANGED @area = " + this.area + ", @sub = " + this.sub + " <<");
    if (this.FIRST_ROUTE) {
      this.FIRST_ROUTE = false;
    }
    if (!this.area) {
      this.area = this.TD().nav.sections.HOME;
    }
    this.trigger(Router.EVENT_HASH_CHANGED, this.area, this.sub, this.params);
    return null;
  };

  Router.prototype.navigateTo = function(where, trigger, replace, params) {
    if (where == null) {
      where = '';
    }
    if (trigger == null) {
      trigger = true;
    }
    if (replace == null) {
      replace = false;
    }
    this.params = params;
    if (where.charAt(0) !== "/") {
      where = "/" + where;
    }
    if (where.charAt(where.length - 1) !== "/") {
      where = "" + where + "/";
    }
    if (!trigger) {
      this.trigger(Router.EVENT_HASH_CHANGED, where, null, this.params);
      return;
    }
    this.navigate(where, {
      trigger: true,
      replace: replace
    });
    return null;
  };

  Router.prototype.TD = function() {
    return window.TD;
  };

  return Router;

})(Backbone.Router);

module.exports = Router;


},{}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/utils/Analytics.coffee":[function(require,module,exports){

/*
Analytics wrapper
 */
var Analytics,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Analytics = (function() {
  Analytics.prototype.tags = null;

  Analytics.prototype.started = false;

  Analytics.prototype.attempts = 0;

  Analytics.prototype.allowedAttempts = 5;

  function Analytics(tags, callback) {
    this.callback = callback;
    this.track = __bind(this.track, this);
    this.onTagsReceived = __bind(this.onTagsReceived, this);
    $.getJSON(tags, this.onTagsReceived);
    return null;
  }

  Analytics.prototype.onTagsReceived = function(data) {
    this.tags = data;
    this.started = true;
    if (typeof this.callback === "function") {
      this.callback();
    }
    return null;
  };


  /*
  @param string id of the tracking tag to be pushed on Analytics
   */

  Analytics.prototype.track = function(param) {
    var arg, args, v, _i, _len;
    if (!this.started) {
      return;
    }
    if (param) {
      v = this.tags[param];
      if (v) {
        args = ['send', 'event'];
        for (_i = 0, _len = v.length; _i < _len; _i++) {
          arg = v[_i];
          args.push(arg);
        }
        if (window.ga) {
          ga.apply(null, args);
        } else if (this.attempts >= this.allowedAttempts) {
          this.started = false;
        } else {
          setTimeout((function(_this) {
            return function() {
              _this.track(param);
              return _this.attempts++;
            };
          })(this), 2000);
        }
      }
    }
    return null;
  };

  return Analytics;

})();

module.exports = Analytics;


},{}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/utils/AuthManager.coffee":[function(require,module,exports){
var AbstractData, AuthManager, Facebook, GooglePlus,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractData = require('../data/AbstractData');

Facebook = require('../utils/Facebook');

GooglePlus = require('../utils/GooglePlus');

AuthManager = (function(_super) {
  __extends(AuthManager, _super);

  AuthManager.prototype.userData = null;

  AuthManager.prototype.process = false;

  AuthManager.prototype.processTimer = null;

  AuthManager.prototype.processWait = 5000;

  function AuthManager() {
    this.hideLoader = __bind(this.hideLoader, this);
    this.showLoader = __bind(this.showLoader, this);
    this.authCallback = __bind(this.authCallback, this);
    this.authFail = __bind(this.authFail, this);
    this.authSuccess = __bind(this.authSuccess, this);
    this.login = __bind(this.login, this);
    this.userData = this.TD().appData.USER;
    AuthManager.__super__.constructor.call(this);
    return null;
  }

  AuthManager.prototype.login = function(service, cb) {
    var $dataDfd;
    if (cb == null) {
      cb = null;
    }
    if (this.process) {
      return;
    }
    this.showLoader();
    this.process = true;
    $dataDfd = $.Deferred();
    switch (service) {
      case 'google':
        GooglePlus.login($dataDfd);
        break;
      case 'facebook':
        Facebook.login($dataDfd);
    }
    $dataDfd.done((function(_this) {
      return function(res) {
        return _this.authSuccess(service, res);
      };
    })(this));
    $dataDfd.fail((function(_this) {
      return function(res) {
        return _this.authFail(service, res);
      };
    })(this));
    $dataDfd.always((function(_this) {
      return function() {
        return _this.authCallback(cb);
      };
    })(this));

    /*
    		Unfortunately no callback is fired if user manually closes G+ login modal,
    		so this is to allow them to close window and then subsequently try to log in again...
     */
    this.processTimer = setTimeout(this.authCallback, this.processWait);
    return $dataDfd;
  };

  AuthManager.prototype.authSuccess = function(service, data) {
    return null;
  };

  AuthManager.prototype.authFail = function(service, data) {
    return null;
  };

  AuthManager.prototype.authCallback = function(cb) {
    if (cb == null) {
      cb = null;
    }
    if (!this.process) {
      return;
    }
    clearTimeout(this.processTimer);
    this.hideLoader();
    this.process = false;
    if (typeof cb === "function") {
      cb();
    }
    return null;
  };


  /*
  	show / hide some UI indicator that we are waiting for social network to respond
   */

  AuthManager.prototype.showLoader = function() {
    return null;
  };

  AuthManager.prototype.hideLoader = function() {
    return null;
  };

  return AuthManager;

})(AbstractData);

module.exports = AuthManager;


},{"../data/AbstractData":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/AbstractData.coffee","../utils/Facebook":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/utils/Facebook.coffee","../utils/GooglePlus":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/utils/GooglePlus.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/utils/Facebook.coffee":[function(require,module,exports){
var AbstractData, Facebook,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractData = require('../data/AbstractData');


/*

Facebook SDK wrapper - load asynchronously, some helper methods
 */

Facebook = (function(_super) {
  __extends(Facebook, _super);

  function Facebook() {
    return Facebook.__super__.constructor.apply(this, arguments);
  }

  Facebook.url = '//connect.facebook.net/en_US/all.js';

  Facebook.permissions = 'email';

  Facebook.$dataDfd = null;

  Facebook.loaded = false;

  Facebook.load = function() {

    /*
    		TO DO
    		include script loader with callback to :init
     */
    return null;
  };

  Facebook.init = function() {
    Facebook.loaded = true;
    FB.init({
      appId: window.config.fb_app_id,
      status: false,
      xfbml: false
    });
    return null;
  };

  Facebook.login = function($dataDfd) {
    Facebook.$dataDfd = $dataDfd;
    if (!Facebook.loaded) {
      return Facebook.$dataDfd.reject('SDK not loaded');
    }
    FB.login(function(res) {
      if (res['status'] === 'connected') {
        return Facebook.getUserData(res['authResponse']['accessToken']);
      } else {
        return Facebook.$dataDfd.reject('no way jose');
      }
    }, {
      scope: Facebook.permissions
    });
    return null;
  };

  Facebook.getUserData = function(token) {
    var $meDfd, $picDfd, userData;
    userData = {};
    userData.access_token = token;
    $meDfd = $.Deferred();
    $picDfd = $.Deferred();
    FB.api('/me', function(res) {
      userData.full_name = res.name;
      userData.social_id = res.id;
      userData.email = res.email || false;
      return $meDfd.resolve();
    });
    FB.api('/me/picture', {
      'width': '200'
    }, function(res) {
      userData.profile_pic = res.data.url;
      return $picDfd.resolve();
    });
    $.when($meDfd, $picDfd).done(function() {
      return Facebook.$dataDfd.resolve(userData);
    });
    return null;
  };

  Facebook.share = function(opts, cb) {
    FB.ui({
      method: opts.method || 'feed',
      name: opts.name || '',
      link: opts.link || '',
      picture: opts.picture || '',
      caption: opts.caption || '',
      description: opts.description || ''
    }, function(response) {
      return typeof cb === "function" ? cb(response) : void 0;
    });
    return null;
  };

  return Facebook;

})(AbstractData);

module.exports = Facebook;


},{"../data/AbstractData":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/AbstractData.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/utils/GooglePlus.coffee":[function(require,module,exports){
var AbstractData, GooglePlus,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractData = require('../data/AbstractData');


/*

Google+ SDK wrapper - load asynchronously, some helper methods
 */

GooglePlus = (function(_super) {
  __extends(GooglePlus, _super);

  function GooglePlus() {
    return GooglePlus.__super__.constructor.apply(this, arguments);
  }

  GooglePlus.url = 'https://apis.google.com/js/client:plusone.js';

  GooglePlus.params = {
    'clientid': null,
    'callback': null,
    'scope': 'https://www.googleapis.com/auth/userinfo.email',
    'cookiepolicy': 'none'
  };

  GooglePlus.$dataDfd = null;

  GooglePlus.loaded = false;

  GooglePlus.load = function() {

    /*
    		TO DO
    		include script loader with callback to :init
     */
    return null;
  };

  GooglePlus.init = function() {
    GooglePlus.loaded = true;
    GooglePlus.params['clientid'] = window.config.gp_app_id;
    GooglePlus.params['callback'] = GooglePlus.loginCallback;
    return null;
  };

  GooglePlus.login = function($dataDfd) {
    GooglePlus.$dataDfd = $dataDfd;
    if (GooglePlus.loaded) {
      gapi.auth.signIn(GooglePlus.params);
    } else {
      GooglePlus.$dataDfd.reject('SDK not loaded');
    }
    return null;
  };

  GooglePlus.loginCallback = function(res) {
    if (res['status']['signed_in']) {
      GooglePlus.getUserData(res['access_token']);
    } else if (res['error']['access_denied']) {
      GooglePlus.$dataDfd.reject('no way jose');
    }
    return null;
  };

  GooglePlus.getUserData = function(token) {
    gapi.client.load('plus', 'v1', function() {
      var request;
      request = gapi.client.plus.people.get({
        'userId': 'me'
      });
      return request.execute(function(res) {
        var userData;
        userData = {
          access_token: token,
          full_name: res.displayName,
          social_id: res.id,
          email: res.emails[0] ? res.emails[0].value : false,
          profile_pic: res.image.url
        };
        return GooglePlus.$dataDfd.resolve(userData);
      });
    });
    return null;
  };

  return GooglePlus;

})(AbstractData);

module.exports = GooglePlus;


},{"../data/AbstractData":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/data/AbstractData.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/utils/Requester.coffee":[function(require,module,exports){

/*
 * Requester #

Wrapper for `$.ajax` calls
 */
var Requester;

Requester = (function() {
  function Requester() {}

  Requester.requests = [];

  Requester.request = function(data) {

    /*
    `data = {`<br>
    `  url         : String`<br>
    `  type        : "POST/GET/PUT"`<br>
    `  data        : Object`<br>
    `  dataType    : jQuery dataType`<br>
    `  contentType : String`<br>
    `}`
     */
    var r;
    r = $.ajax({
      url: data.url,
      type: data.type ? data.type : "POST",
      data: data.data ? data.data : null,
      dataType: data.dataType ? data.dataType : "json",
      contentType: data.contentType ? data.contentType : "application/x-www-form-urlencoded; charset=UTF-8",
      processData: data.processData !== null && data.processData !== void 0 ? data.processData : true
    });
    r.done(data.done);
    r.fail(data.fail);
    return r;
  };

  Requester.addImage = function(data, done, fail) {

    /*
    ** Usage: <br>
    `data = canvass.toDataURL("image/jpeg").slice("data:image/jpeg;base64,".length)`<br>
    `Requester.addImage data, "zoetrope", @done, @fail`
     */
    Requester.request({
      url: '/api/images/',
      type: 'POST',
      data: {
        image_base64: encodeURI(data)
      },
      done: done,
      fail: fail
    });
    return null;
  };

  Requester.deleteImage = function(id, done, fail) {
    Requester.request({
      url: '/api/images/' + id,
      type: 'DELETE',
      done: done,
      fail: fail
    });
    return null;
  };

  return Requester;

})();

module.exports = Requester;


},{}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/utils/Share.coffee":[function(require,module,exports){

/*
Sharing class for non-SDK loaded social networks.
If SDK is loaded, and provides share methods, then use that class instead, eg. `Facebook.share` instead of `Share.facebook`
 */
var Share,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Share = (function() {
  Share.prototype.url = null;

  function Share() {
    this.TD = __bind(this.TD, this);
    this.weibo = __bind(this.weibo, this);
    this.renren = __bind(this.renren, this);
    this.twitter = __bind(this.twitter, this);
    this.facebook = __bind(this.facebook, this);
    this.tumblr = __bind(this.tumblr, this);
    this.pinterest = __bind(this.pinterest, this);
    this.plus = __bind(this.plus, this);
    this.openWin = __bind(this.openWin, this);
    this.url = this.TD().BASE_PATH;
    return null;
  }

  Share.prototype.openWin = function(url, w, h) {
    var left, top;
    left = (screen.availWidth - w) >> 1;
    top = (screen.availHeight - h) >> 1;
    window.open(url, '', 'top=' + top + ',left=' + left + ',width=' + w + ',height=' + h + ',location=no,menubar=no');
    return null;
  };

  Share.prototype.plus = function(url) {
    url = encodeURIComponent(url || this.url);
    this.openWin("https://plus.google.com/share?url=" + url, 650, 385);
    return null;
  };

  Share.prototype.pinterest = function(url, media, descr) {
    url = encodeURIComponent(url || this.url);
    media = encodeURIComponent(media);
    descr = encodeURIComponent(descr);
    this.openWin("http://www.pinterest.com/pin/create/button/?url=" + url + "&media=" + media + "&description=" + descr, 735, 310);
    return null;
  };

  Share.prototype.tumblr = function(url, media, descr) {
    url = encodeURIComponent(url || this.url);
    media = encodeURIComponent(media);
    descr = encodeURIComponent(descr);
    this.openWin("http://www.tumblr.com/share/photo?source=" + media + "&caption=" + descr + "&click_thru=" + url, 450, 430);
    return null;
  };

  Share.prototype.facebook = function(url, copy) {
    var decsr;
    if (copy == null) {
      copy = '';
    }
    url = encodeURIComponent(url || this.url);
    decsr = encodeURIComponent(copy);
    this.openWin("http://www.facebook.com/share.php?u=" + url + "&t=" + decsr, 600, 300);
    return null;
  };

  Share.prototype.twitter = function(url, copy) {
    var descr;
    if (copy == null) {
      copy = '';
    }
    url = encodeURIComponent(url || this.url);
    if (copy === '') {
      copy = this.TD().locale.get('seo_twitter_card_description');
    }
    descr = encodeURIComponent(copy);
    this.openWin("http://twitter.com/intent/tweet/?text=" + descr + "&url=" + url, 600, 300);
    return null;
  };

  Share.prototype.renren = function(url) {
    url = encodeURIComponent(url || this.url);
    this.openWin("http://share.renren.com/share/buttonshare.do?link=" + url, 600, 300);
    return null;
  };

  Share.prototype.weibo = function(url) {
    url = encodeURIComponent(url || this.url);
    this.openWin("http://service.weibo.com/share/share.php?url=" + url + "&language=zh_cn", 600, 300);
    return null;
  };

  Share.prototype.TD = function() {
    return window.TD;
  };

  return Share;

})();

module.exports = Share;


},{}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/AbstractView.coffee":[function(require,module,exports){
var AbstractView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = (function(_super) {
  __extends(AbstractView, _super);

  function AbstractView() {
    this.TD = __bind(this.TD, this);
    this.dispose = __bind(this.dispose, this);
    this.callChildrenAndSelf = __bind(this.callChildrenAndSelf, this);
    this.callChildren = __bind(this.callChildren, this);
    this.triggerChildren = __bind(this.triggerChildren, this);
    this.removeAllChildren = __bind(this.removeAllChildren, this);
    this.muteAll = __bind(this.muteAll, this);
    this.unMuteAll = __bind(this.unMuteAll, this);
    this.CSSTranslate = __bind(this.CSSTranslate, this);
    this.mouseEnabled = __bind(this.mouseEnabled, this);
    this.onResize = __bind(this.onResize, this);
    this.remove = __bind(this.remove, this);
    this.replace = __bind(this.replace, this);
    this.addChild = __bind(this.addChild, this);
    this.render = __bind(this.render, this);
    this.update = __bind(this.update, this);
    this.init = __bind(this.init, this);
    return AbstractView.__super__.constructor.apply(this, arguments);
  }

  AbstractView.prototype.el = null;

  AbstractView.prototype.id = null;

  AbstractView.prototype.children = null;

  AbstractView.prototype.template = null;

  AbstractView.prototype.templateVars = null;

  AbstractView.prototype.initialize = function() {
    var tmpHTML;
    this.children = [];
    if (this.template) {
      tmpHTML = _.template(this.TD().templates.get(this.template));
      this.setElement(tmpHTML(this.templateVars));
    }
    if (this.id) {
      this.$el.attr('id', this.id);
    }
    if (this.className) {
      this.$el.addClass(this.className);
    }
    this.init();
    this.paused = false;
    return null;
  };

  AbstractView.prototype.init = function() {
    return null;
  };

  AbstractView.prototype.update = function() {
    return null;
  };

  AbstractView.prototype.render = function() {
    return null;
  };

  AbstractView.prototype.addChild = function(child, prepend) {
    var c, target;
    if (prepend == null) {
      prepend = false;
    }
    if (child.el) {
      this.children.push(child);
    }
    target = this.addToSelector ? this.$el.find(this.addToSelector).eq(0) : this.$el;
    c = child.el ? child.$el : child;
    if (!prepend) {
      target.append(c);
    } else {
      target.prepend(c);
    }
    return this;
  };

  AbstractView.prototype.replace = function(dom, child) {
    var c;
    if (child.el) {
      this.children.push(child);
    }
    c = child.el ? child.$el : child;
    this.$el.children(dom).replaceWith(c);
    return null;
  };

  AbstractView.prototype.remove = function(child) {
    var c;
    if (child == null) {
      return;
    }
    c = child.el ? child.$el : $(child);
    if (c && child.dispose) {
      child.dispose();
    }
    if (c && this.children.indexOf(child) !== -1) {
      this.children.splice(this.children.indexOf(child), 1);
    }
    c.remove();
    return null;
  };

  AbstractView.prototype.onResize = function(event) {
    var child, _i, _len, _ref;
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (child.onResize) {
        child.onResize();
      }
    }
    return null;
  };

  AbstractView.prototype.mouseEnabled = function(enabled) {
    this.$el.css({
      "pointer-events": enabled ? "auto" : "none"
    });
    return null;
  };

  AbstractView.prototype.CSSTranslate = function(x, y, value, scale) {
    var str;
    if (value == null) {
      value = '%';
    }
    if (Modernizr.csstransforms3d) {
      str = "translate3d(" + (x + value) + ", " + (y + value) + ", 0)";
    } else {
      str = "translate(" + (x + value) + ", " + (y + value) + ")";
    }
    if (scale) {
      str = "" + str + " scale(" + scale + ")";
    }
    return str;
  };

  AbstractView.prototype.unMuteAll = function() {
    var child, _i, _len, _ref;
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (typeof child.unMute === "function") {
        child.unMute();
      }
      if (child.children.length) {
        child.unMuteAll();
      }
    }
    return null;
  };

  AbstractView.prototype.muteAll = function() {
    var child, _i, _len, _ref;
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (typeof child.mute === "function") {
        child.mute();
      }
      if (child.children.length) {
        child.muteAll();
      }
    }
    return null;
  };

  AbstractView.prototype.removeAllChildren = function() {
    var child, _i, _len, _ref;
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      this.remove(child);
    }
    return null;
  };

  AbstractView.prototype.triggerChildren = function(msg, children) {
    var child, i, _i, _len;
    if (children == null) {
      children = this.children;
    }
    for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
      child = children[i];
      child.trigger(msg);
      if (child.children.length) {
        this.triggerChildren(msg, child.children);
      }
    }
    return null;
  };

  AbstractView.prototype.callChildren = function(method, params, children) {
    var child, i, _i, _len;
    if (children == null) {
      children = this.children;
    }
    for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
      child = children[i];
      if (typeof child[method] === "function") {
        child[method](params);
      }
      if (child.children.length) {
        this.callChildren(method, params, child.children);
      }
    }
    return null;
  };

  AbstractView.prototype.callChildrenAndSelf = function(method, params, children) {
    var child, i, _i, _len;
    if (children == null) {
      children = this.children;
    }
    if (typeof this[method] === "function") {
      this[method](params);
    }
    for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
      child = children[i];
      if (typeof child[method] === "function") {
        child[method](params);
      }
      if (child.children.length) {
        this.callChildren(method, params, child.children);
      }
    }
    return null;
  };

  AbstractView.prototype.supplantString = function(str, vals) {
    return str.replace(/{{ ([^{}]*) }}/g, function(a, b) {
      var r;
      r = vals[b];
      if (typeof r === "string" || typeof r === "number") {
        return r;
      } else {
        return a;
      }
    });
  };

  AbstractView.prototype.dispose = function() {

    /*
    		override on per view basis - unbind event handlers etc
     */
    return null;
  };

  AbstractView.prototype.TD = function() {
    return window.TD;
  };

  return AbstractView;

})(Backbone.View);

module.exports = AbstractView;


},{}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/AbstractViewPage.coffee":[function(require,module,exports){
var AbstractView, AbstractViewPage,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('./AbstractView');

AbstractViewPage = (function(_super) {
  __extends(AbstractViewPage, _super);

  function AbstractViewPage() {
    this.setListeners = __bind(this.setListeners, this);
    this.dispose = __bind(this.dispose, this);
    this.hide = __bind(this.hide, this);
    this.show = __bind(this.show, this);
    return AbstractViewPage.__super__.constructor.apply(this, arguments);
  }

  AbstractViewPage.prototype._shown = false;

  AbstractViewPage.prototype._listening = false;

  AbstractViewPage.prototype.show = function(cb) {
    if (!!this._shown) {
      return;
    }
    this._shown = true;

    /*
    		CHANGE HERE - 'page' views are always in DOM - to save having to re-initialise gmap events (PITA). No longer require :dispose method
     */
    this.TD().appView.wrapper.addChild(this);
    this.callChildrenAndSelf('setListeners', 'on');

    /* replace with some proper transition if we can */
    this.$el.css({
      'visibility': 'visible'
    });
    if (typeof cb === "function") {
      cb();
    }
    return null;
  };

  AbstractViewPage.prototype.hide = function(cb) {
    if (!this._shown) {
      return;
    }
    this._shown = false;

    /*
    		CHANGE HERE - 'page' views are always in DOM - to save having to re-initialise gmap events (PITA). No longer require :dispose method
     */
    this.TD().appView.wrapper.remove(this);

    /* replace with some proper transition if we can */
    this.$el.css({
      'visibility': 'hidden'
    });
    if (typeof cb === "function") {
      cb();
    }
    return null;
  };

  AbstractViewPage.prototype.dispose = function() {
    this.callChildrenAndSelf('setListeners', 'off');
    return null;
  };

  AbstractViewPage.prototype.setListeners = function(setting) {
    if (setting === this._listening) {
      return;
    }
    this._listening = setting;
    return null;
  };

  return AbstractViewPage;

})(AbstractView);

module.exports = AbstractViewPage;


},{"./AbstractView":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/AbstractView.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/base/Footer.coffee":[function(require,module,exports){
var AbstractView, Footer,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../AbstractView');

Footer = (function(_super) {
  __extends(Footer, _super);

  Footer.prototype.template = 'site-footer';

  function Footer() {
    this.templateVars = {
      desc: this.TD().locale.get("footer_desc")
    };
    Footer.__super__.constructor.call(this);
    return null;
  }

  return Footer;

})(AbstractView);

module.exports = Footer;


},{"../AbstractView":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/AbstractView.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/base/Header.coffee":[function(require,module,exports){
var AbstractView, Header,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../AbstractView');

Header = (function(_super) {
  __extends(Header, _super);

  Header.prototype.template = 'site-header';

  Header.prototype.events = {
    'click [data-login]': 'onLoginClick'
  };

  function Header() {
    this.onLoginClick = __bind(this.onLoginClick, this);
    this.render = __bind(this.render, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.userData = this.TD().appData.user;
    this.tmpl = _.template(this.TD().templates.get(this.template));
    this.templateVars = {
      desc: this.TD().locale.get("header_desc")
    };
    this.templateVars = $.extend(this.templateVars, this.userData.info.toJSON(), this.userData.status.toJSON());
    Header.__super__.constructor.call(this);
    this.bindEvents();
    return null;
  }

  Header.prototype.bindEvents = function() {
    this.userData.on(this.userData.EVENT_USER_LOGGED, this.render);
    return null;
  };

  Header.prototype.render = function() {
    var vars;
    vars = $.extend(this.templateVars, this.userData.info.toJSON(), this.userData.status.toJSON());
    this.$el.html(this.tmpl(vars));
    return null;
  };

  Header.prototype.onLoginClick = function() {
    this.TD().appData.user.login();
    return null;
  };

  return Header;

})(AbstractView);

module.exports = Header;


},{"../AbstractView":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/AbstractView.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/base/Preloader.coffee":[function(require,module,exports){
var AbstractView, Preloader,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../AbstractView');

Preloader = (function(_super) {
  __extends(Preloader, _super);

  Preloader.prototype.cb = null;

  Preloader.prototype.TRANSITION_TIME = 0.5;

  function Preloader() {
    this.onHideComplete = __bind(this.onHideComplete, this);
    this.hide = __bind(this.hide, this);
    this.onShowComplete = __bind(this.onShowComplete, this);
    this.show = __bind(this.show, this);
    this.init = __bind(this.init, this);
    this.setElement($('#preloader'));
    Preloader.__super__.constructor.call(this);
    return null;
  }

  Preloader.prototype.init = function() {
    return null;
  };

  Preloader.prototype.show = function(cb) {
    this.cb = cb;
    this.$el.css({
      'display': 'block'
    });
    return null;
  };

  Preloader.prototype.onShowComplete = function() {
    if (typeof this.cb === "function") {
      this.cb();
    }
    return null;
  };

  Preloader.prototype.hide = function(cb) {
    this.cb = cb;
    this.onHideComplete();
    return null;
  };

  Preloader.prototype.onHideComplete = function() {
    this.$el.css({
      'display': 'none'
    });
    if (typeof this.cb === "function") {
      this.cb();
    }
    return null;
  };

  return Preloader;

})(AbstractView);

module.exports = Preloader;


},{"../AbstractView":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/AbstractView.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/base/Wrapper.coffee":[function(require,module,exports){
var AbstractView, ExamplePageView, HomeView, Nav, Wrapper,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../AbstractView');

HomeView = require('../home/HomeView');

ExamplePageView = require('../examplePage/ExamplePageView');

Nav = require('../../router/Nav');

Wrapper = (function(_super) {
  __extends(Wrapper, _super);

  Wrapper.prototype.VIEW_TYPE_PAGE = 'page';

  Wrapper.prototype.VIEW_TYPE_MODAL = 'modal';

  Wrapper.prototype.template = 'wrapper';

  Wrapper.prototype.views = null;

  Wrapper.prototype.previousView = null;

  Wrapper.prototype.currentView = null;

  Wrapper.prototype.backgroundView = null;

  function Wrapper() {
    this.transitionViews = __bind(this.transitionViews, this);
    this.changeSubView = __bind(this.changeSubView, this);
    this.changeView = __bind(this.changeView, this);
    this.bindEvents = __bind(this.bindEvents, this);
    this.start = __bind(this.start, this);
    this.init = __bind(this.init, this);
    this.getViewByRoute = __bind(this.getViewByRoute, this);
    this.addClasses = __bind(this.addClasses, this);
    this.createClasses = __bind(this.createClasses, this);
    this.views = {
      home: {
        classRef: HomeView,
        route: this.TD().nav.sections.HOME,
        view: null,
        type: this.VIEW_TYPE_PAGE
      },
      quests: {
        classRef: ExamplePageView,
        route: this.TD().nav.sections.EXAMPLE,
        view: null,
        type: this.VIEW_TYPE_PAGE
      }
    };
    this.createClasses();
    Wrapper.__super__.constructor.call(this);
    return null;
  }

  Wrapper.prototype.createClasses = function() {
    var data, name, _ref;
    _ref = this.views;
    for (name in _ref) {
      data = _ref[name];
      this.views[name].view = new this.views[name].classRef;
    }
    return null;
  };

  Wrapper.prototype.addClasses = function() {
    var data, name, _ref, _results;
    _ref = this.views;
    _results = [];
    for (name in _ref) {
      data = _ref[name];
      if (data.type === this.VIEW_TYPE_PAGE) {
        _results.push(this.addChild(data.view));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  null;

  Wrapper.prototype.getViewByRoute = function(route) {
    var data, name, _ref;
    _ref = this.views;
    for (name in _ref) {
      data = _ref[name];
      if (route === this.views[name].route) {
        return this.views[name];
      }
    }
    return null;
  };

  Wrapper.prototype.init = function() {
    this.TD().appView.on('start', this.start);
    return null;
  };

  Wrapper.prototype.start = function() {
    this.TD().appView.off('start', this.start);
    this.bindEvents();
    return null;
  };

  Wrapper.prototype.bindEvents = function() {
    this.TD().nav.on(Nav.EVENT_CHANGE_VIEW, this.changeView);
    this.TD().nav.on(Nav.EVENT_CHANGE_SUB_VIEW, this.changeSubView);
    return null;
  };


  /*
  
  	THIS IS A MESS, SORT IT (neil)
   */

  Wrapper.prototype.changeView = function(previous, current) {
    this.previousView = this.getViewByRoute(previous.area);
    this.currentView = this.getViewByRoute(current.area);
    if (!this.previousView) {
      if (this.currentView.type === this.VIEW_TYPE_PAGE) {
        this.transitionViews(false, this.currentView.view);
      } else if (this.currentView.type === this.VIEW_TYPE_MODAL) {
        this.backgroundView = this.views.home;
        this.transitionViews(false, this.currentView.view, true);
      }
    } else {
      if (this.currentView.type === this.VIEW_TYPE_PAGE && this.previousView.type === this.VIEW_TYPE_PAGE) {
        this.transitionViews(this.previousView.view, this.currentView.view);
      } else if (this.currentView.type === this.VIEW_TYPE_MODAL && this.previousView.type === this.VIEW_TYPE_PAGE) {
        this.backgroundView = this.previousView;
        this.transitionViews(false, this.currentView.view, true);
      } else if (this.currentView.type === this.VIEW_TYPE_PAGE && this.previousView.type === this.VIEW_TYPE_MODAL) {
        this.backgroundView = this.backgroundView || this.views.home;
        if (this.backgroundView !== this.currentView) {
          this.transitionViews(this.previousView.view, this.currentView.view, false, true);
        } else if (this.backgroundView === this.currentView) {
          this.transitionViews(this.previousView.view, false);
        }
      } else if (this.currentView.type === this.VIEW_TYPE_MODAL && this.previousView.type === this.VIEW_TYPE_MODAL) {
        this.backgroundView = this.backgroundView || this.views.home;
        this.transitionViews(this.previousView.view, this.currentView.view, true);
      }
    }
    return null;
  };

  Wrapper.prototype.changeSubView = function(current) {
    this.currentView.view.trigger(Nav.EVENT_CHANGE_SUB_VIEW, current.sub);
    return null;
  };

  Wrapper.prototype.transitionViews = function(from, to, toModal, fromModal) {
    var _ref, _ref1;
    if (toModal == null) {
      toModal = false;
    }
    if (fromModal == null) {
      fromModal = false;
    }
    if (from === to) {
      return;
    }
    if (toModal) {
      if ((_ref = this.backgroundView.view) != null) {
        _ref.show();
      }
    }
    if (fromModal) {
      if ((_ref1 = this.backgroundView.view) != null) {
        _ref1.hide();
      }
    }
    if (from && to) {
      from.hide(to.show);
    } else if (from) {
      from.hide();
    } else if (to) {
      to.show();
    }
    return null;
  };

  return Wrapper;

})(AbstractView);

module.exports = Wrapper;


},{"../../router/Nav":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/router/Nav.coffee","../AbstractView":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/AbstractView.coffee","../examplePage/ExamplePageView":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/examplePage/ExamplePageView.coffee","../home/HomeView":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/home/HomeView.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/examplePage/ExamplePageView.coffee":[function(require,module,exports){
var AbstractViewPage, ExamplePageView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractViewPage = require('../AbstractViewPage');

ExamplePageView = (function(_super) {
  __extends(ExamplePageView, _super);

  ExamplePageView.prototype.template = 'page-example';

  function ExamplePageView() {
    this.templateVars = {
      desc: this.TD().locale.get("example_desc")
    };

    /*
    
    		instantiate classes here
    
    		@exampleClass = new ExampleClass
     */
    ExamplePageView.__super__.constructor.call(this);

    /*
    
    		add classes to app structure here
    
    		@
    			.addChild(@exampleClass)
     */
    return null;
  }

  return ExamplePageView;

})(AbstractViewPage);

module.exports = ExamplePageView;


},{"../AbstractViewPage":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/AbstractViewPage.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/home/HomeView.coffee":[function(require,module,exports){
var AbstractViewPage, HomeView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractViewPage = require('../AbstractViewPage');

HomeView = (function(_super) {
  __extends(HomeView, _super);

  HomeView.prototype.template = 'page-home';

  function HomeView() {
    this.templateVars = {
      desc: this.TD().locale.get("home_desc")
    };

    /*
    
    		instantiate classes here
    
    		@exampleClass = new ExampleClass
     */
    HomeView.__super__.constructor.call(this);

    /*
    
    		add classes to app structure here
    
    		@
    			.addChild(@exampleClass)
     */
    return null;
  }

  return HomeView;

})(AbstractViewPage);

module.exports = HomeView;


},{"../AbstractViewPage":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/AbstractViewPage.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/modals/AbstractModal.coffee":[function(require,module,exports){
var AbstractModal, AbstractView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../AbstractView');

AbstractModal = (function(_super) {
  __extends(AbstractModal, _super);

  AbstractModal.prototype.$window = null;


  /* override in individual classes */

  AbstractModal.prototype.name = null;

  AbstractModal.prototype.template = null;

  function AbstractModal() {
    this.closeClick = __bind(this.closeClick, this);
    this.animateOut = __bind(this.animateOut, this);
    this.animateIn = __bind(this.animateIn, this);
    this.onKeyUp = __bind(this.onKeyUp, this);
    this.setListeners = __bind(this.setListeners, this);
    this.dispose = __bind(this.dispose, this);
    this.hide = __bind(this.hide, this);
    this.$window = $(window);
    AbstractModal.__super__.constructor.call(this);
    this.TD().appView.addChild(this);
    this.setListeners('on');
    this.animateIn();
    return null;
  }

  AbstractModal.prototype.hide = function() {
    this.animateOut((function(_this) {
      return function() {
        return _this.TD().appView.remove(_this);
      };
    })(this));
    return null;
  };

  AbstractModal.prototype.dispose = function() {
    this.setListeners('off');
    this.TD().appView.modalManager.modals[this.name].view = null;
    return null;
  };

  AbstractModal.prototype.setListeners = function(setting) {
    this.$window[setting]('keyup', this.onKeyUp);
    this.$('[data-close]')[setting]('click', this.closeClick);
    return null;
  };

  AbstractModal.prototype.onKeyUp = function(e) {
    if (e.keyCode === 27) {
      this.hide();
    }
    return null;
  };

  AbstractModal.prototype.animateIn = function() {
    TweenLite.to(this.$el, 0.3, {
      'visibility': 'visible',
      'opacity': 1,
      ease: Quad.easeOut
    });
    TweenLite.to(this.$el.find('.inner'), 0.3, {
      delay: 0.15,
      'transform': 'scale(1)',
      'visibility': 'visible',
      'opacity': 1,
      ease: Back.easeOut
    });
    return null;
  };

  AbstractModal.prototype.animateOut = function(callback) {
    TweenLite.to(this.$el, 0.3, {
      delay: 0.15,
      'opacity': 0,
      ease: Quad.easeOut,
      onComplete: callback
    });
    TweenLite.to(this.$el.find('.inner'), 0.3, {
      'transform': 'scale(0.8)',
      'opacity': 0,
      ease: Back.easeIn
    });
    return null;
  };

  AbstractModal.prototype.closeClick = function(e) {
    e.preventDefault();
    this.hide();
    return null;
  };

  return AbstractModal;

})(AbstractView);

module.exports = AbstractModal;


},{"../AbstractView":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/AbstractView.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/modals/OrientationModal.coffee":[function(require,module,exports){
var AbstractModal, OrientationModal,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractModal = require('./AbstractModal');

OrientationModal = (function(_super) {
  __extends(OrientationModal, _super);

  OrientationModal.prototype.name = 'orientationModal';

  OrientationModal.prototype.template = 'orientation-modal';

  OrientationModal.prototype.cb = null;

  function OrientationModal(cb) {
    this.cb = cb;
    this.onUpdateDims = __bind(this.onUpdateDims, this);
    this.setListeners = __bind(this.setListeners, this);
    this.hide = __bind(this.hide, this);
    this.init = __bind(this.init, this);
    this.templateVars = {
      name: this.name
    };
    OrientationModal.__super__.constructor.call(this);
    return null;
  }

  OrientationModal.prototype.init = function() {
    return null;
  };

  OrientationModal.prototype.hide = function(stillLandscape) {
    if (stillLandscape == null) {
      stillLandscape = true;
    }
    this.animateOut((function(_this) {
      return function() {
        _this.TD().appView.remove(_this);
        if (!stillLandscape) {
          return typeof _this.cb === "function" ? _this.cb() : void 0;
        }
      };
    })(this));
    return null;
  };

  OrientationModal.prototype.setListeners = function(setting) {
    OrientationModal.__super__.setListeners.apply(this, arguments);
    this.TD().appView[setting]('updateDims', this.onUpdateDims);
    this.$el[setting]('touchend click', this.hide);
    return null;
  };

  OrientationModal.prototype.onUpdateDims = function(dims) {
    if (dims.o === 'portrait') {
      this.hide(false);
    }
    return null;
  };

  return OrientationModal;

})(AbstractModal);

module.exports = OrientationModal;


},{"./AbstractModal":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/modals/AbstractModal.coffee"}],"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/modals/_ModalManager.coffee":[function(require,module,exports){
var AbstractView, ModalManager, OrientationModal,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractView = require('../AbstractView');

OrientationModal = require('./OrientationModal');

ModalManager = (function(_super) {
  __extends(ModalManager, _super);

  ModalManager.prototype.modals = {
    orientationModal: {
      classRef: OrientationModal,
      view: null
    }
  };

  function ModalManager() {
    this.showModal = __bind(this.showModal, this);
    this.hideOpenModal = __bind(this.hideOpenModal, this);
    this.isOpen = __bind(this.isOpen, this);
    this.init = __bind(this.init, this);
    ModalManager.__super__.constructor.call(this);
    return null;
  }

  ModalManager.prototype.init = function() {
    return null;
  };

  ModalManager.prototype.isOpen = function() {
    var modal, name, _ref;
    _ref = this.modals;
    for (name in _ref) {
      modal = _ref[name];
      if (this.modals[name].view) {
        return true;
      }
    }
    return false;
  };

  ModalManager.prototype.hideOpenModal = function() {
    var modal, name, openModal, _ref;
    _ref = this.modals;
    for (name in _ref) {
      modal = _ref[name];
      if (this.modals[name].view) {
        openModal = this.modals[name].view;
      }
    }
    if (openModal != null) {
      openModal.hide();
    }
    return null;
  };

  ModalManager.prototype.showModal = function(name, cb) {
    if (cb == null) {
      cb = null;
    }
    if (this.modals[name].view) {
      return;
    }
    this.modals[name].view = new this.modals[name].classRef(cb);
    return null;
  };

  return ModalManager;

})(AbstractView);

module.exports = ModalManager;


},{"../AbstractView":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/AbstractView.coffee","./OrientationModal":"/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/view/modals/OrientationModal.coffee"}]},{},["/Users/neilcarpenter/Sites/twitter-doodles/project/coffee/Main.coffee"])
(function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q=function(a,b){return function(){return a.apply(b,arguments)}},R={}.hasOwnProperty,S=function(a,b){function c(){this.constructor=a}for(var d in b)R.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a};f=function(a){function b(){return this.twd=Q(this.twd,this),b.__super__.constructor.apply(this,arguments)}return S(b,a),b.prototype.twd=function(){return P.twd},b}(Backbone.DeepModel),b=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return S(b,a),b.prototype.defaults={start:"{{ BASE_PATH }}/api/start",locale:"{{ BASE_PATH }}/api/l10n/{{ code }}",user:{login:"{{ BASE_PATH }}/api/user/login",register:"{{ BASE_PATH }}/api/user/register",password:"{{ BASE_PATH }}/api/user/password",update:"{{ BASE_PATH }}/api/user/update",logout:"{{ BASE_PATH }}/api/user/logout",remove:"{{ BASE_PATH }}/api/user/remove"}},b}(Backbone.DeepModel),y=function(a){function b(){return this.getString=Q(this.getString,this),this.get_language=Q(this.get_language,this),b.__super__.constructor.apply(this,arguments)}return S(b,a),b.prototype.defaults={code:null,language:null,strings:null},b.prototype.get_language=function(){return this.get("language")},b.prototype.getString=function(a){var b,c,d,e,f,g;f=this.get("strings");for(d in f){e=f[d],g=e.strings;for(b in g)if(c=g[b],b===a)return c}return null},b}(Backbone.Model),I=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return S(b,a),b.prototype.defaults={id:"",text:""},b}(Backbone.Model),M=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return S(b,a),b.prototype.defaults="",b}(f),N=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return S(b,a),b.prototype.defaults={logged:!1},b}(f),c=function(a){function b(){return this.twd=Q(this.twd,this),b.__super__.constructor.apply(this,arguments)}return S(b,a),b.prototype.twd=function(){return P.twd},b}(Backbone.Collection),K=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return S(b,a),b.prototype.model=I,b}(Backbone.Collection),d=function(){function a(){return this.twd=Q(this.twd,this),_.extend(this,Backbone.Events),null}return a.prototype.twd=function(){return P.twd},a}(),a=function(){function a(){}return a.model=new b,a.getContants=function(){return{BASE_PATH:a.twd().BASE_PATH}},a.get=function(b,c){return c=$.extend(!0,c,a.getContants()),a.supplantString(a.model.get(b),c)},a.supplantString=function(a,b){return a.replace(/{{ ([^{}]*) }}/g,function(a,c){var d;return d=b[c]||("number"==typeof b[c]?b[c].toString():"")})},a.twd=function(){return P.twd},a}(),x=function(){function b(b,c){this.getLocaleImage=Q(this.getLocaleImage,this),this.get=Q(this.get,this),this.loadBackup=Q(this.loadBackup,this),this.onSuccess=Q(this.onSuccess,this),this.getLang=Q(this.getLang,this),this.callback=c,this.backup=b,this.lang=this.getLang(),$.ajax({url:a.get("locale",{code:this.lang}),type:"GET",success:this.onSuccess,error:this.loadBackup})}return b.prototype.lang=null,b.prototype.data=null,b.prototype.callback=null,b.prototype.backup=null,b.prototype["default"]="en-gb",b.prototype.getLang=function(){var a;return a=window.location.search&&window.location.search.match("lang=")?window.location.search.split("lang=")[1].split("&")[0]:window.config.localeCode?window.config.localeCode:this["default"]},b.prototype.onSuccess=function(a){var b;return b=null,b=a.responseText?JSON.parse(a.responseText):a,this.data=new y(b),"function"==typeof this.callback&&this.callback(),null},b.prototype.loadBackup=function(){return $.ajax({url:this.backup,dataType:"json",complete:this.onSuccess,error:function(){return function(){}}(this)}),null},b.prototype.get=function(a){return this.data.getString(a)},b.prototype.getLocaleImage=function(a){return window.config.CDN+"/images/locale/"+window.config.localeCode+"/"+a},b}(),J=function(){function a(a,b){this.get=Q(this.get,this),this.parseXML=Q(this.parseXML,this),this.cb=b,$.ajax({url:a,success:this.parseXML})}return a.prototype.templates=null,a.prototype.cb=null,a.prototype.parseXML=function(a){var b;return b=[],$(a).find("template").each(function(a,c){var d;return d=$(c),b.push(new I({id:d.attr("id").toString(),text:$.trim(d.text())}))}),this.templates=new K(b),"function"==typeof this.cb&&this.cb(),null},a.prototype.get=function(a){var b;return b=this.templates.where({id:a}),b=b[0].get("text"),$.trim(b)},a}(),L=function(b){function c(){return this.onLogoutDone=Q(this.onLogoutDone,this),this.removeUser=Q(this.removeUser,this),this.logout=Q(this.logout,this),this.loginFail=Q(this.loginFail,this),this.loginSuccess=Q(this.loginSuccess,this),this.login=Q(this.login,this),this.registerFail=Q(this.registerFail,this),this.registerSuccess=Q(this.registerSuccess,this),this.register=Q(this.register,this),this.onLoggedChange=Q(this.onLoggedChange,this),this.bindEvents=Q(this.bindEvents,this),this.status=new N,this.info=new M,c.__super__.constructor.call(this),this.bindEvents(),null}return S(c,b),c.prototype.status=null,c.prototype.info=null,c.prototype.EVENT_USER_LOGGED="EVENT_USER_LOGGED",c.prototype.bindEvents=function(){return this.status.on("change:logged",this.onLoggedChange),null},c.prototype.onLoggedChange=function(){return this.status.get("logged")&&this.trigger(this.EVENT_USER_LOGGED),null},c.prototype.register=function(b){var c;return c=F.request({url:a.get("user.register"),type:"POST",data:b}),c.done(this.registerSuccess),c.fail(this.registerFail),c},c.prototype.registerSuccess=function(a){return a},c.prototype.registerFail=function(a){return a},c.prototype.login=function(b){var c;return c=F.request({url:a.get("user.login"),type:"POST",data:b}),c.done(this.loginSuccess),c.fail(this.loginFail),c},c.prototype.loginSuccess=function(a){return a.user?null:void 0},c.prototype.loginFail=function(){return null},c.prototype.logout=function(b){var c,d;return null==b&&(b=!1),c=a.get(b?"user.remove":"user.logout"),d=F.request({url:c,type:"POST"}),d.done(this.onLogoutDone),null},c.prototype.removeUser=function(){return this.logout(!0),null},c.prototype.onLogoutDone=function(){return window.location.href=this.twd().BASE_PATH,null},c}(d),l=function(b){function c(a){return this.callback=a,this.onStartDataReceived=Q(this.onStartDataReceived,this),this.getStartData=Q(this.getStartData,this),c.__super__.constructor.call(this),this.getStartData(),null}return S(c,b),c.prototype.callback=null,c.prototype.getStartData=function(){var b;return b=F.request({url:a.get("start"),type:"GET"}),b.done(this.onStartDataReceived),b.fail(function(a){return function(){return"function"==typeof a.callback?a.callback():void 0}}(this)),null},c.prototype.onStartDataReceived=function(){return"function"==typeof this.callback&&this.callback(),null},c}(d),j=function(){function a(a,b){return this.callback=b,this.track=Q(this.track,this),this.onTagsReceived=Q(this.onTagsReceived,this),$.getJSON(a,this.onTagsReceived),null}return a.prototype.tags=null,a.prototype.started=!1,a.prototype.attempts=0,a.prototype.allowedAttempts=5,a.prototype.onTagsReceived=function(a){return this.tags=a,this.started=!0,"function"==typeof this.callback&&this.callback(),null},a.prototype.track=function(a){var b,c,d,e,f;if(this.started){if(a&&(d=this.tags[a])){for(c=["send","event"],e=0,f=d.length;f>e;e++)b=d[e],c.push(b);window.ga?ga.apply(null,c):this.attempts>=this.allowedAttempts?this.started=!1:setTimeout(function(b){return function(){return b.track(a),b.attempts++}}(this),2e3)}return null}},a}(),n=function(a){function b(){return this.hideLoader=Q(this.hideLoader,this),this.showLoader=Q(this.showLoader,this),this.authCallback=Q(this.authCallback,this),this.authFail=Q(this.authFail,this),this.authSuccess=Q(this.authSuccess,this),this.login=Q(this.login,this),this.userData=this.twd().appData.USER,b.__super__.constructor.call(this),null}return S(b,a),b.prototype.userData=null,b.prototype.process=!1,b.prototype.processTimer=null,b.prototype.processWait=5e3,b.prototype.login=function(a,b){var c;if(null==b&&(b=null),!this.process){switch(this.showLoader(),this.process=!0,c=$.Deferred(),a){case"google":s.login(c);break;case"facebook":q.login(c)}return c.done(function(b){return function(c){return b.authSuccess(a,c)}}(this)),c.fail(function(b){return function(c){return b.authFail(a,c)}}(this)),c.always(function(a){return function(){return a.authCallback(b)}}(this)),this.processTimer=setTimeout(this.authCallback,this.processWait),c}},b.prototype.authSuccess=function(){return null},b.prototype.authFail=function(){return null},b.prototype.authCallback=function(a){return null==a&&(a=null),this.process?(clearTimeout(this.processTimer),this.hideLoader(),this.process=!1,"function"==typeof a&&a(),null):void 0},b.prototype.showLoader=function(){return null},b.prototype.hideLoader=function(){return null},b}(d),o=function(){function a(){}return a.getLocalDate=function(a,b,c){var d,e,f;return null==c&&(c=0),e=a.split("/"),a=[e[1],e[0],"20"+e[2]].join("/"),d=new Date(""+a+" "+b+" UTC"),f=d.getTime()+108e5+864e5*c,new Date(f)},a}(),q=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return S(b,a),b.url="//connect.facebook.net/en_US/all.js",b.permissions="email",b.$dataDfd=null,b.loaded=!1,b.load=function(){return require([b.url],b.init),null},b.init=function(){return b.loaded=!0,FB.init({appId:window.config.fb_app_id,status:!1,xfbml:!1}),null},b.login=function(a){return b.$dataDfd=a,b.loaded?(FB.login(function(a){return"connected"===a.status?b.getUserData(a.authResponse.accessToken):b.$dataDfd.reject("no way jose")},{scope:b.permissions}),null):b.$dataDfd.reject("SDK not loaded")},b.getUserData=function(a){var c,d,e;return e={},e.access_token=a,c=$.Deferred(),d=$.Deferred(),FB.api("/me",function(a){return e.full_name=a.name,e.social_id=a.id,e.email=a.email||!1,c.resolve()}),FB.api("/me/picture",{width:"200"},function(a){return e.profile_pic=a.data.url,d.resolve()}),$.when(c,d).done(function(){return b.$dataDfd.resolve(e)}),null},b.share=function(a,b){return FB.ui({method:a.method||"feed",name:a.name||"",link:a.link||"",picture:a.picture||"",caption:a.caption||"",description:a.description||""},function(a){return"function"==typeof b?b(a):void 0}),null},b}(d),s=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return S(b,a),b.url="https://apis.google.com/js/client:plusone.js",b.params={clientid:null,callback:null,scope:"https://www.googleapis.com/auth/userinfo.email",cookiepolicy:"none"},b.$dataDfd=null,b.loaded=!1,b.load=function(){return require([b.url],b.init),null},b.init=function(){return b.loaded=!0,b.params.clientid=window.config.gp_app_id,b.params.callback=b.loginCallback,null},b.login=function(a){return b.$dataDfd=a,b.loaded?gapi.auth.signIn(b.params):b.$dataDfd.reject("SDK not loaded"),null},b.loginCallback=function(a){return a.status.signed_in?b.getUserData(a.access_token):a.error.access_denied&&b.$dataDfd.reject("no way jose"),null},b.getUserData=function(a){return gapi.client.load("plus","v1",function(){var c;return c=gapi.client.plus.people.get({userId:"me"}),c.execute(function(c){var d;return d={access_token:a,full_name:c.displayName,social_id:c.id,email:c.emails[0]?c.emails[0].value:!1,profile_pic:c.image.url},b.$dataDfd.resolve(d)})}),null},b}(d),w=function(){function a(){}return a.load=function(a){var b,c;return b=$.Deferred(),c=new Image,c.onload=function(){return function(){return b.resolve(c)}}(this),c.src=a,b},a.loadSet=function(b){var c,d,e,f;for(d=[],e=0,f=b.length;f>e;e++)c=b[e],d.push(a.load(c).promise());return $.when.apply(null,d)},a}(),B=function(){function a(){}return a.MATH_COS=Math.cos,a.MATH_SIN=Math.sin,a.MATH_RANDOM=Math.random,a.MATH_ABS=Math.abs,a.MATH_ATAN2=Math.atan2,a.limit=function(a,b,c){return Math.min(Math.max(b,a),c)},a.map=function(a,b,c,d,e,f,g,h){var i,j;return null==f&&(f=!1),null==g&&(g=!0),null==h&&(h=!0),g&&b>a?d:h&&a>c?e:(i=(a-b)/(c-b),j=i*(e-d)+d,f?Math.round(j):j)},a.getRandomColor=function(){var a,b,c,d;for(c="0123456789ABCDEF".split(""),a="#",b=d=0;6>d;b=++d)a+=c[Math.round(15*Math.random())];return a},a.getTimeStampDiff=function(a,b){var c,d,e,f,g;return f=864e5,g={},c=a.getTime(),d=b.getTime(),e=d-c,e/=1e3,g.seconds=Math.floor(e%60),e/=60,g.minutes=Math.floor(e%60),e/=60,g.hours=Math.floor(e%24),g.days=Math.floor(e/24),g},a.map=function(a,b,c,d,e,f,g,h){var i,j;return null==f&&(f=!1),null==g&&(g=!0),null==h&&(h=!0),g&&b>a?d:h&&a>c?e:(i=(a-b)/(c-b),j=i*(e-d)+d,f?Math.round(j):j)},a.toRadians=function(a){return a*(Math.PI/180)},a.toDegree=function(a){return a*(180/Math.PI)},a.isInRange=function(a,b,c,d){return d?a>=b&&c>=a:a>=b&&c>=a},a.getNiceDistance=function(a){var b;return 1e3>a?""+Math.round(a)+"M":(b=(a/1e3).toFixed(2),""+b+"KM")},a}(),D=function(){function a(){}return a.getRichText=function(b){var c,d;return d=a._getPostType(b),c=function(){switch(!0){case"twitter"===d:return a._getRichText_TW(b.text);case"instagram"===d:return a._getRichText_IG(b.text)}}()},a._getRichText_TW=function(a){var b;return b=/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,a=a.replace(b,"<a href='$1' target='_blank'>$1</a>"),b=/#(\w+)/g,a=a.replace(b,"<a href='http://twitter.com/search?q=%23$1' target='_blank'>#$1</a>"),b=/@(\w+)/g,a=a.replace(b,"<a href='http://www.twitter.com/$1' target='_blank'>@$1</a>")},a._getRichText_IG=function(a){var b;return b=/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,a=a.replace(b,"<a href='$1' target='_blank'>$1</a>"),b=/@(\w+)/g,a=a.replace(b,"<a href='http://www.instagram.com/$1' target='_blank'>@$1</a>")},a.getUsernameLink=function(b){var c,d;return d=a._getPostType(b),c=function(){switch(!0){case"twitter"===d:return a._getUsernameLink_TW(b);case"instagram"===d:return a._getUsernameLink_IG(b)}}()},a._getUsernameLink_TW=function(a){return'<a href="http://twitter.com/'+a.user.screen_name+'" target="_blank">@'+a.user.screen_name+"</a>"},a._getUsernameLink_IG=function(a){return'<a href="http://instagram.com/'+a.user.screen_name+'" target="_blank">@'+a.user.screen_name+"</a>"},a._getPostType=function(a){return/instagram/.test(a.source)?"instagram":"twitter"},a}(),F=function(){function a(){}return a.requests=[],a.request=function(a){var b;return b=$.ajax({url:a.url,type:a.type?a.type:"POST",data:a.data?a.data:null,dataType:a.dataType?a.dataType:"json",contentType:a.contentType?a.contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:null!==a.processData&&void 0!==a.processData?a.processData:!0}),b.done(a.done),b.fail(a.fail),b},a.send=function(a,b){var c,d,e,f;c=new FormData;for(d in b)e=b[d],c.append(d,e);return f=new XMLHttpRequest,f.open("POST",a,!0),f.onload=function(){},f.send(c),null},a.addImage=function(b,c,d){return a.request({url:"/api/images/",type:"POST",data:{image_base64:encodeURI(b)},done:c,fail:d}),null},a.deleteImage=function(b,c,d){return a.request({url:"/api/images/"+b,type:"DELETE",done:c,fail:d}),null},a}(),H=function(){function a(){return this.twd=Q(this.twd,this),this.weibo=Q(this.weibo,this),this.renren=Q(this.renren,this),this.twitter=Q(this.twitter,this),this.facebook=Q(this.facebook,this),this.tumblr=Q(this.tumblr,this),this.pinterest=Q(this.pinterest,this),this.plus=Q(this.plus,this),this.openWin=Q(this.openWin,this),this.url=this.twd().BASE_PATH,null}return a.prototype.url=null,a.prototype.openWin=function(a,b,c){var d,e;return d=screen.availWidth-b>>1,e=screen.availHeight-c>>1,window.open(a,"","top="+e+",left="+d+",width="+b+",height="+c+",location=no,menubar=no"),null},a.prototype.plus=function(a){return a=encodeURIComponent(a||this.url),this.openWin("https://plus.google.com/share?url="+a,650,385),null},a.prototype.pinterest=function(a,b,c){return a=encodeURIComponent(a||this.url),b=encodeURIComponent(b),c=encodeURIComponent(c),this.openWin("http://www.pinterest.com/pin/create/button/?url="+a+"&media="+b+"&description="+c,735,310),null},a.prototype.tumblr=function(a,b,c){return a=encodeURIComponent(a||this.url),b=encodeURIComponent(b),c=encodeURIComponent(c),this.openWin("http://www.tumblr.com/share/photo?source="+b+"&caption="+c+"&click_thru="+a,450,430),null},a.prototype.facebook=function(a,b){var c;return null==b&&(b=""),a=encodeURIComponent(a||this.url),c=encodeURIComponent(b),this.openWin("http://www.facebook.com/share.php?u="+a+"&t="+c,600,300),null},a.prototype.twitter=function(a,b){var c;return null==b&&(b=""),a=encodeURIComponent(a||this.url),""===b&&(b=this.twd().locale.get("seo_twitter_card_description")),c=encodeURIComponent(b),this.openWin("http://twitter.com/intent/tweet/?text="+c+"&url="+a,600,300),null},a.prototype.renren=function(a){return a=encodeURIComponent(a||this.url),this.openWin("http://share.renren.com/share/buttonshare.do?link="+a,600,300),null},a.prototype.weibo=function(a){return a=encodeURIComponent(a||this.url),this.openWin("http://service.weibo.com/share/share.php?url="+a+"&language=zh_cn",600,300),null},a.prototype.twd=function(){return P.twd},a}(),g=function(a){function b(){return this.twd=Q(this.twd,this),this.dispose=Q(this.dispose,this),this.callChildrenAndSelf=Q(this.callChildrenAndSelf,this),this.callChildren=Q(this.callChildren,this),this.triggerChildren=Q(this.triggerChildren,this),this.removeAllChildren=Q(this.removeAllChildren,this),this.muteAll=Q(this.muteAll,this),this.unMuteAll=Q(this.unMuteAll,this),this.CSSTranslate=Q(this.CSSTranslate,this),this.mouseEnabled=Q(this.mouseEnabled,this),this.onResize=Q(this.onResize,this),this.remove=Q(this.remove,this),this.replace=Q(this.replace,this),this.addChild=Q(this.addChild,this),this.render=Q(this.render,this),this.update=Q(this.update,this),this.init=Q(this.init,this),b.__super__.constructor.apply(this,arguments)}return S(b,a),b.prototype.el=null,b.prototype.id=null,b.prototype.children=null,b.prototype.template=null,b.prototype.templateVars=null,b.prototype.initialize=function(){var a;return this.children=[],this.template&&(a=_.template(this.twd().templates.get(this.template)),this.setElement(a(this.templateVars))),this.id&&this.$el.attr("id",this.id),this.className&&this.$el.addClass(this.className),this.init(),this.paused=!1,null},b.prototype.init=function(){return null},b.prototype.update=function(){return null},b.prototype.render=function(){return null},b.prototype.addChild=function(a,b){var c,d;return null==b&&(b=!1),a.el&&this.children.push(a),d=this.addToSelector?this.$el.find(this.addToSelector).eq(0):this.$el,c=a.el?a.$el:a,b?d.prepend(c):d.append(c),this},b.prototype.replace=function(a,b){var c;return b.el&&this.children.push(b),c=b.el?b.$el:b,this.$el.children(a).replaceWith(c),null},b.prototype.remove=function(a){var b;if(null!=a)return b=a.el?a.$el:$(a),b&&a.dispose&&a.dispose(),b&&-1!==this.children.indexOf(a)&&this.children.splice(this.children.indexOf(a),1),b.remove(),null},b.prototype.onResize=function(){var a,b,c,d;for(d=this.children,b=0,c=d.length;c>b;b++)a=d[b],a.onResize&&a.onResize();return null},b.prototype.mouseEnabled=function(a){return this.$el.css({"pointer-events":a?"auto":"none"}),null},b.prototype.CSSTranslate=function(a,b,c,d){var e;return null==c&&(c="%"),e=Modernizr.csstransforms3d?"translate3d("+(a+c)+", "+(b+c)+", 0)":"translate("+(a+c)+", "+(b+c)+")",d&&(e=""+e+" scale("+d+")"),e},b.prototype.unMuteAll=function(){var a,b,c,d;for(d=this.children,b=0,c=d.length;c>b;b++)a=d[b],"function"==typeof a.unMute&&a.unMute(),a.children.length&&a.unMuteAll();return null},b.prototype.muteAll=function(){var a,b,c,d;for(d=this.children,b=0,c=d.length;c>b;b++)a=d[b],"function"==typeof a.mute&&a.mute(),a.children.length&&a.muteAll();return null},b.prototype.removeAllChildren=function(){var a,b,c,d;for(d=this.children,b=0,c=d.length;c>b;b++)a=d[b],this.remove(a);return null},b.prototype.triggerChildren=function(a,b){var c,d,e,f;for(null==b&&(b=this.children),d=e=0,f=b.length;f>e;d=++e)c=b[d],c.trigger(a),c.children.length&&this.triggerChildren(a,c.children);return null},b.prototype.callChildren=function(a,b,c){var d,e,f,g;for(null==c&&(c=this.children),e=f=0,g=c.length;g>f;e=++f)d=c[e],"function"==typeof d[a]&&d[a](b),d.children.length&&this.callChildren(a,b,d.children);return null},b.prototype.callChildrenAndSelf=function(a,b,c){var d,e,f,g;for(null==c&&(c=this.children),"function"==typeof this[a]&&this[a](b),e=f=0,g=c.length;g>f;e=++f)d=c[e],"function"==typeof d[a]&&d[a](b),d.children.length&&this.callChildren(a,b,d.children);return null},b.prototype.supplantString=function(a,b){return a.replace(/{{ ([^{}]*) }}/g,function(a,c){var d;return d=b[c],"string"==typeof d||"number"==typeof d?d:a})},b.prototype.dispose=function(){return null},b.prototype.twd=function(){return P.twd},b}(Backbone.View),h=function(a){function b(){return this.animateOutDone=Q(this.animateOutDone,this),this.animateOut=Q(this.animateOut,this),this.animateInDone=Q(this.animateInDone,this),this.animateIn=Q(this.animateIn,this),this.close=Q(this.close,this),this.onCloseClick=Q(this.onCloseClick,this),this.setListeners=Q(this.setListeners,this),this.dispose=Q(this.dispose,this),this.hide=Q(this.hide,this),this.show=Q(this.show,this),b.__super__.constructor.apply(this,arguments)}return S(b,a),b.prototype._shown=!1,b.prototype._listening=!1,b.prototype.TRANSITION_TIME=.3,b.prototype.show=function(a){return this._shown?void 0:(this._shown=!0,this.brz().appView.wrapper.addChild(this),this.animateIn(a),null)},b.prototype.hide=function(a){return this._shown?(this._shown=!1,this.animateOut(a),null):void 0},b.prototype.dispose=function(){return this.callChildrenAndSelf("setListeners","off"),null},b.prototype.setListeners=function(a){return a===this._listening?"noListenerChange":(this._listening=a,this.$el[a]("click","[data-close-modal]",this.onCloseClick),null)},b.prototype.onCloseClick=function(a){return a.preventDefault(),this.close(),null},b.prototype.close=function(){return this.brz().router.navigateTo(this.brz().appView.wrapper.backgroundView.route),null},b.prototype.animateIn=function(a){return this.$el.css({visibility:"visible"}),TweenLite.fromTo(this.$el,this.TRANSITION_TIME,{transform:this.CSSTranslate(-50,-45),opacity:0},{transform:this.CSSTranslate(-50,-50),opacity:1,ease:Cubic.easeInOut,onComplete:this.animateInDone,onCompleteParams:[a]}),null},b.prototype.animateInDone=function(a){return this.callChildrenAndSelf("setListeners","on"),"function"==typeof a&&a(),this.brz().appView.modalPlayBtn.show(),null},b.prototype.animateOut=function(a){return this.brz().appView.modalPlayBtn.hide(),TweenLite.to(this.$el,this.TRANSITION_TIME,{transform:this.CSSTranslate(-50,-55),opacity:0,ease:Cubic.easeInOut,onComplete:this.animateOutDone,onCompleteParams:[a]}),null},b.prototype.animateOutDone=function(a){return this.$el.css({visibility:"hidden"}),this.brz().appView.wrapper.remove(this),"function"==typeof a&&a(),null},b}(g),i=function(a){function b(){return this.setListeners=Q(this.setListeners,this),this.dispose=Q(this.dispose,this),this.hide=Q(this.hide,this),this.show=Q(this.show,this),b.__super__.constructor.apply(this,arguments)}return S(b,a),b.prototype._shown=!1,b.prototype._listening=!1,b.prototype.show=function(a){return this._shown?void 0:(this._shown=!0,this.twd().appView.wrapper.addChild(this),this.callChildrenAndSelf("setListeners","on"),this.$el.css({visibility:"visible"}),"function"==typeof a&&a(),null)},b.prototype.hide=function(a){return this._shown?(this._shown=!1,this.twd().appView.wrapper.remove(this),this.$el.css({visibility:"hidden"}),"function"==typeof a&&a(),null):void 0},b.prototype.dispose=function(){return this.callChildrenAndSelf("setListeners","off"),null},b.prototype.setListeners=function(a){return a!==this._listening?(this._listening=a,null):void 0},b}(g),r=function(a){function b(){return this.templateVars={desc:this.twd().locale.get("footer_desc")},b.__super__.constructor.call(this),null}return S(b,a),b.prototype.template="site-footer",b}(g),t=function(a){function b(){return this.templateVars={desc:this.twd().locale.get("header_desc"),home:{label:"Go to homepage",url:this.twd().BASE_PATH+"/"+this.twd().nav.sections.HOME},example:{label:"Go to example page",url:this.twd().BASE_PATH+"/"+this.twd().nav.sections.EXAMPLE}},b.__super__.constructor.call(this),null}return S(b,a),b.prototype.template="site-header",b}(g),E=function(a){function b(){return this.onHideComplete=Q(this.onHideComplete,this),this.hide=Q(this.hide,this),this.onShowComplete=Q(this.onShowComplete,this),this.show=Q(this.show,this),this.init=Q(this.init,this),this.setElement($("#preloader")),b.__super__.constructor.call(this),null}return S(b,a),b.prototype.cb=null,b.prototype.TRANSITION_TIME=.5,b.prototype.init=function(){return null},b.prototype.show=function(a){return this.cb=a,this.$el.css({display:"block"}),null},b.prototype.onShowComplete=function(){return"function"==typeof this.cb&&this.cb(),null},b.prototype.hide=function(a){return this.cb=a,this.onHideComplete(),null},b.prototype.onHideComplete=function(){return this.$el.css({display:"none"}),"function"==typeof this.cb&&this.cb(),null},b}(g),O=function(a){function b(){return this.transitionViews=Q(this.transitionViews,this),this.changeSubView=Q(this.changeSubView,this),this.changeView=Q(this.changeView,this),this.bindEvents=Q(this.bindEvents,this),this.start=Q(this.start,this),this.init=Q(this.init,this),this.getViewByRoute=Q(this.getViewByRoute,this),this.addClasses=Q(this.addClasses,this),this.createClasses=Q(this.createClasses,this),this.views={home:{classRef:u,route:this.twd().nav.sections.HOME,view:null,type:this.VIEW_TYPE_PAGE},quests:{classRef:p,route:this.twd().nav.sections.EXAMPLE,view:null,type:this.VIEW_TYPE_PAGE}},this.createClasses(),b.__super__.constructor.call(this),null}return S(b,a),b.prototype.VIEW_TYPE_PAGE="page",b.prototype.VIEW_TYPE_MODAL="modal",b.prototype.template="wrapper",b.prototype.views=null,b.prototype.previousView=null,b.prototype.currentView=null,b.prototype.backgroundView=null,b.prototype.createClasses=function(){var a,b,c;c=this.views;for(b in c)a=c[b],this.views[b].view=new this.views[b].classRef;return null},b.prototype.addClasses=function(){var a,b,c,d;c=this.views,d=[];for(b in c)a=c[b],d.push(a.type===this.VIEW_TYPE_PAGE?this.addChild(a.view):void 0);return d},b.prototype.getViewByRoute=function(a){var b,c,d;d=this.views;for(c in d)if(b=d[c],a===this.views[c].route)return this.views[c];return null},b.prototype.init=function(){return this.twd().appView.on("start",this.start),null},b.prototype.start=function(){return this.twd().appView.off("start",this.start),this.bindEvents(),null},b.prototype.bindEvents=function(){return this.twd().nav.on(A.EVENT_CHANGE_VIEW,this.changeView),this.twd().nav.on(A.EVENT_CHANGE_SUB_VIEW,this.changeSubView),null},b.prototype.changeView=function(a,b){return this.previousView=this.getViewByRoute(a.area),this.currentView=this.getViewByRoute(b.area),this.previousView?this.currentView.type===this.VIEW_TYPE_PAGE&&this.previousView.type===this.VIEW_TYPE_PAGE?this.transitionViews(this.previousView.view,this.currentView.view):this.currentView.type===this.VIEW_TYPE_MODAL&&this.previousView.type===this.VIEW_TYPE_PAGE?(this.backgroundView=this.previousView,this.transitionViews(!1,this.currentView.view,!0)):this.currentView.type===this.VIEW_TYPE_PAGE&&this.previousView.type===this.VIEW_TYPE_MODAL?(this.backgroundView=this.backgroundView||this.views.home,this.backgroundView!==this.currentView?this.transitionViews(this.previousView.view,this.currentView.view,!1,!0):this.backgroundView===this.currentView&&this.transitionViews(this.previousView.view,!1)):this.currentView.type===this.VIEW_TYPE_MODAL&&this.previousView.type===this.VIEW_TYPE_MODAL&&(this.backgroundView=this.backgroundView||this.views.home,this.transitionViews(this.previousView.view,this.currentView.view,!0)):this.currentView.type===this.VIEW_TYPE_PAGE?this.transitionViews(!1,this.currentView.view):this.currentView.type===this.VIEW_TYPE_MODAL&&(this.backgroundView=this.views.home,this.transitionViews(!1,this.currentView.view,!0)),null},b.prototype.changeSubView=function(a){return this.currentView.view.trigger(A.EVENT_CHANGE_SUB_VIEW,a.sub),null},b.prototype.transitionViews=function(a,b,c,d){var e,f;return null==c&&(c=!1),null==d&&(d=!1),a!==b?(c&&null!=(e=this.backgroundView.view)&&e.show(),d&&null!=(f=this.backgroundView.view)&&f.hide(),a&&b?a.hide(b.show):a?a.hide():b&&b.show(),null):void 0},b}(g),p=function(a){function b(){return this.templateVars={desc:this.twd().locale.get("example_desc")},b.__super__.constructor.call(this),null}return S(b,a),b.prototype.template="page-example",b}(i),u=function(a){function b(){return this.templateVars={desc:this.twd().locale.get("home_desc")},b.__super__.constructor.call(this),null}return S(b,a),b.prototype.template="page-home",b}(i),e=function(a){function b(){return this.closeClick=Q(this.closeClick,this),this.animateOut=Q(this.animateOut,this),this.animateIn=Q(this.animateIn,this),this.onKeyUp=Q(this.onKeyUp,this),this.setListeners=Q(this.setListeners,this),this.dispose=Q(this.dispose,this),this.hide=Q(this.hide,this),this.$window=$(window),b.__super__.constructor.call(this),this.twd().appView.addChild(this),this.setListeners("on"),this.animateIn(),null}return S(b,a),b.prototype.$window=null,b.prototype.name=null,b.prototype.template=null,b.prototype.hide=function(){return this.animateOut(function(a){return function(){return a.twd().appView.remove(a)}}(this)),null},b.prototype.dispose=function(){return this.setListeners("off"),this.twd().appView.modalManager.modals[this.name].view=null,null},b.prototype.setListeners=function(a){return this.$window[a]("keyup",this.onKeyUp),this.$("[data-close]")[a]("click",this.closeClick),null},b.prototype.onKeyUp=function(a){return 27===a.keyCode&&this.hide(),null},b.prototype.animateIn=function(){return TweenLite.to(this.$el,.3,{visibility:"visible",opacity:1,ease:Quad.easeOut}),TweenLite.to(this.$el.find(".inner"),.3,{delay:.15,transform:"scale(1)",visibility:"visible",opacity:1,ease:Back.easeOut}),null},b.prototype.animateOut=function(a){return TweenLite.to(this.$el,.3,{delay:.15,opacity:0,ease:Quad.easeOut,onComplete:a}),TweenLite.to(this.$el.find(".inner"),.3,{transform:"scale(0.8)",opacity:0,ease:Back.easeIn}),null},b.prototype.closeClick=function(a){return a.preventDefault(),this.hide(),null},b}(g),C=function(a){function b(a){return this.cb=a,this.onUpdateDims=Q(this.onUpdateDims,this),this.setListeners=Q(this.setListeners,this),this.hide=Q(this.hide,this),this.init=Q(this.init,this),this.templateVars={name:this.name},b.__super__.constructor.call(this),null}return S(b,a),b.prototype.name="orientationModal",b.prototype.template="orientation-modal",b.prototype.cb=null,b.prototype.init=function(){return null},b.prototype.hide=function(a){return null==a&&(a=!0),this.animateOut(function(b){return function(){return b.twd().appView.remove(b),a?void 0:"function"==typeof b.cb?b.cb():void 0}}(this)),null},b.prototype.setListeners=function(a){return b.__super__.setListeners.apply(this,arguments),this.twd().appView[a]("updateDims",this.onUpdateDims),this.$el[a]("touchend click",this.hide),null},b.prototype.onUpdateDims=function(a){return"portrait"===a.o&&this.hide(!1),null},b}(e),z=function(a){function b(){return this.showModal=Q(this.showModal,this),this.hideOpenModal=Q(this.hideOpenModal,this),this.isOpen=Q(this.isOpen,this),this.init=Q(this.init,this),b.__super__.constructor.call(this),null}return S(b,a),b.prototype.modals={orientationModal:{classRef:C,view:null}},b.prototype.init=function(){return null},b.prototype.isOpen=function(){var a,b,c;c=this.modals;for(b in c)if(a=c[b],this.modals[b].view)return!0;return!1},b.prototype.hideOpenModal=function(){var a,b,c,d;d=this.modals;for(b in d)a=d[b],this.modals[b].view&&(c=this.modals[b].view);return null!=c&&c.hide(),null},b.prototype.showModal=function(a,b){return null==b&&(b=null),this.modals[a].view?void 0:(this.modals[a].view=new this.modals[a].classRef(b),null)
},b}(g),A=function(a){function b(){return this.setPageTitle=Q(this.setPageTitle,this),this.changeView=Q(this.changeView,this),this.getSection=Q(this.getSection,this),this.twd().router.on(G.EVENT_HASH_CHANGED,this.changeView),!1}return S(b,a),b.EVENT_CHANGE_VIEW="EVENT_CHANGE_VIEW",b.EVENT_CHANGE_SUB_VIEW="EVENT_CHANGE_SUB_VIEW",b.prototype.sections={HOME:"",EXAMPLE:"example"},b.prototype.current={area:null,sub:null},b.prototype.previous={area:null,sub:null},b.prototype.getSection=function(a){var b,c,d;if(""===a)return!0;d=this.sections;for(b in d)if(c=d[b],c===a)return b;return!1},b.prototype.changeView=function(a,c){return this.previous=this.current,this.current={area:a,sub:c},this.previous.area&&this.previous.area===this.current.area?this.trigger(b.EVENT_CHANGE_SUB_VIEW,this.current):(this.trigger(b.EVENT_CHANGE_VIEW,this.previous,this.current),this.trigger(b.EVENT_CHANGE_SUB_VIEW,this.current)),this.twd().appView.modalManager.isOpen()&&this.twd().appView.modalManager.hideOpenModal(),this.setPageTitle(a,c),null},b.prototype.setPageTitle=function(){var a;return a="PAGE TITLE HERE - LOCALISE BASED ON URL",window.document.title!==a&&(window.document.title=a),null},b}(g),G=function(a){function b(){return this.twd=Q(this.twd,this),this.navigateTo=Q(this.navigateTo,this),this.hashChanged=Q(this.hashChanged,this),this.start=Q(this.start,this),b.__super__.constructor.apply(this,arguments)}return S(b,a),b.EVENT_HASH_CHANGED="EVENT_HASH_CHANGED",b.prototype.FIRST_ROUTE=!0,b.prototype.routes={"(/)(:area)(/:sub)(/)":"hashChanged","*actions":"navigateTo"},b.prototype.area=null,b.prototype.sub=null,b.prototype.params=null,b.prototype.start=function(){return Backbone.history.start({pushState:!0,root:"/"}),null},b.prototype.hashChanged=function(a,c){return this.area=null!=a?a:null,this.sub=null!=c?c:null,this.FIRST_ROUTE&&(this.FIRST_ROUTE=!1),this.area||(this.area=this.twd().nav.sections.HOME),this.trigger(b.EVENT_HASH_CHANGED,this.area,this.sub,this.params),null},b.prototype.navigateTo=function(a,c,d,e){return null==a&&(a=""),null==c&&(c=!0),null==d&&(d=!1),this.params=e,"/"!==a.charAt(0)&&(a="/"+a),"/"!==a.charAt(a.length-1)&&(a=""+a+"/"),c?(this.navigate(a,{trigger:!0,replace:d}),null):void this.trigger(b.EVENT_HASH_CHANGED,a,null,this.params)},b.prototype.twd=function(){return P.twd},b}(Backbone.Router),m=function(a){function b(){return this.handleExternalLink=Q(this.handleExternalLink,this),this.navigateToUrl=Q(this.navigateToUrl,this),this.linkManager=Q(this.linkManager,this),this.getDims=Q(this.getDims,this),this.onResize=Q(this.onResize,this),this.begin=Q(this.begin,this),this.onAllRendered=Q(this.onAllRendered,this),this.bindEvents=Q(this.bindEvents,this),this.render=Q(this.render,this),this.enableTouch=Q(this.enableTouch,this),this.disableTouch=Q(this.disableTouch,this),this.$window=$(window),this.$body=$("body").eq(0),b.__super__.constructor.call(this),null}return S(b,a),b.prototype.template="main",b.prototype.$window=null,b.prototype.$body=null,b.prototype.wrapper=null,b.prototype.footer=null,b.prototype.dims={w:null,h:null,o:null,c:null},b.prototype.events={"click a":"linkManager"},b.prototype.EVENT_UPDATE_DIMENSIONS="EVENT_UPDATE_DIMENSIONS",b.prototype.MOBILE_WIDTH=700,b.prototype.MOBILE="mobile",b.prototype.NON_MOBILE="non_mobile",b.prototype.disableTouch=function(){return this.$window.on("touchmove",this.onTouchMove),null},b.prototype.enableTouch=function(){return this.$window.off("touchmove",this.onTouchMove),null},b.prototype.onTouchMove=function(a){return a.preventDefault(),null},b.prototype.render=function(){return this.bindEvents(),this.preloader=new E,this.modalManager=new z,this.header=new t,this.wrapper=new O,this.footer=new r,this.addChild(this.header).addChild(this.wrapper).addChild(this.footer),this.onAllRendered(),null},b.prototype.bindEvents=function(){return this.on("allRendered",this.onAllRendered),this.onResize(),this.onResize=_.debounce(this.onResize,300),this.$window.on("resize orientationchange",this.onResize),null},b.prototype.onAllRendered=function(){return this.$body.prepend(this.$el),this.begin(),null},b.prototype.begin=function(){return this.trigger("start"),this.twd().router.start(),this.preloader.hide(),null},b.prototype.onResize=function(){return this.getDims(),null},b.prototype.getDims=function(){var a,b;return b=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,a=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight,this.dims={w:b,h:a,o:a>b?"portrait":"landscape",c:b<=this.MOBILE_WIDTH?this.MOBILE:this.NON_MOBILE},this.trigger(this.EVENT_UPDATE_DIMENSIONS,this.dims),null},b.prototype.linkManager=function(a){var b;return(b=$(a.currentTarget).attr("href"))?(this.navigateToUrl(b,a),null):!1},b.prototype.navigateToUrl=function(a,b){var c,d;return null==b&&(b=null),c=a.match(this.twd().BASE_PATH)?a.split(this.twd().BASE_PATH)[1]:a,d=0===c.indexOf("/")?c.split("/")[1]:c,this.twd().nav.getSection(d)?(null!=b&&b.preventDefault(),this.twd().router.navigateTo(c)):this.handleExternalLink(a),null},b.prototype.handleExternalLink=function(){return null},b}(g),k=function(){function a(a){return this.LIVE=a,this.cleanup=Q(this.cleanup,this),this.go=Q(this.go,this),this.initApp=Q(this.initApp,this),this.initSDKs=Q(this.initSDKs,this),this.initObjects=Q(this.initObjects,this),this.init=Q(this.init,this),this.objectComplete=Q(this.objectComplete,this),this.setFlags=Q(this.setFlags,this),null}return a.prototype.LIVE=null,a.prototype.BASE_PATH=window.config.hostname,a.prototype.localeCode=window.config.localeCode,a.prototype.objReady=0,a.prototype._toClean=["objReady","setFlags","objectComplete","init","initObjects","initSDKs","initApp","go","cleanup","_toClean"],a.prototype.setFlags=function(){var a;return a=navigator.userAgent.toLowerCase(),this.IS_ANDROID=a.indexOf("android")>-1,this.IS_FIREFOX=a.indexOf("firefox")>-1,this.IS_CHROME_IOS=a.match("crios")?!0:!1,null},a.prototype.objectComplete=function(){return this.objReady++,this.objReady>=4&&this.initApp(),null},a.prototype.init=function(){return this.initObjects(),null},a.prototype.initObjects=function(){return this.templates=new J("/data/templates"+(this.LIVE?".min":"")+".xml",this.objectComplete),this.locale=new x("/data/locales/strings.json",this.objectComplete),this.analytics=new j("/data/tracking.json",this.objectComplete),this.appData=new l(this.objectComplete),null},a.prototype.initSDKs=function(){return q.load(),s.load(),null},a.prototype.initApp=function(){return this.setFlags(),this.appView=new m,this.router=new G,this.nav=new A,this.auth=new n,this.share=new H,this.go(),this.initSDKs(),null},a.prototype.go=function(){return this.appView.render(),this.cleanup(),null},a.prototype.cleanup=function(){var a,b,c,d;for(d=this._toClean,b=0,c=d.length;c>b;b++)a=d[b],this[a]=null,delete this[a];return null},a}(),v=function(){return window.location.host.indexOf("localhost")>-1||"?d"===window.location.search?!1:!0}(),P=v?{}:window||document,P.twd=new k(v),P.twd.init()}).call(this);
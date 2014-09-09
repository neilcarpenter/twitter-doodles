AbstractData               = require './AbstractData'
Requester                  = require '../utils/Requester'
API                        = require './API'
UserStatusModel            = require '../models/core/UserStatusModel'
UserInfoModel              = require '../models/core/UserInfoModel'
RawTweetsCollection        = require '../collections/tweets/RawTweetsCollection'
ProcessedTweetsCollection  = require '../collections/tweets/ProcessedTweetsCollection'
ProcessedTweetsSampleModel = require '../models/tweets/ProcessedTweetsSampleModel'

class UserData extends AbstractData

	status   : null
	info     : null

	EVENT_USER_LOGGED : 'EVENT_USER_LOGGED'

	constructor : ->

		@status   = new UserStatusModel
		@info     = new UserInfoModel

		@tweetsRaw    = new RawTweetsCollection
		@tweetsData   = new ProcessedTweetsCollection
		@tweetsSample = new ProcessedTweetsSampleModel

		super()

		@bindEvents()

		return null

	bindEvents : =>

		@status.on 'change:logged', @onLoggedChange
		@on @EVENT_USER_LOGGED, @getTweets

		null

	onLoggedChange : =>

		if @status.get('logged')

			@trigger @EVENT_USER_LOGGED

		null

	login : (data) =>

		# DEBUG!!!!
		return @getTweets()

		@setupLogin()

		url  = '/auth/twitter'
		w    = 680
		h    = 540
		left = ( screen.availWidth  - w ) >> 1
		top  = ( screen.availHeight - h ) >> 1
		opts = 'width=' + w + ',height=' + h + ',top=' + top + ',left=' + left + ',location=0,menubar=0,scrollbars=0,status=0,toolbar=0,resizable=0'

		window._loginWindow = window.open(url, 'loginWindow', opts)

		null

	setupLogin : =>

		window.$loginDfd = $.Deferred()
		window.$loginDfd.done @loginSuccess
		window.$loginDfd.fail -> @loginFail

		null

	loginSuccess : (data) =>

		console.log "login successful -->", data

		@info.set data
		window._loginWindow.close()

		@status.set 'logged', true

		null

	loginFail : (res) =>

		console.log "failed to log in... -->", res

		null

	getTweets : =>

		data =
			user_id : @info.get('id')
			token : @info.get('token')
			tokenSecret : @info.get('tokenSecret')

		r = Requester.request
			url  : API.get('getTweets')
			type : "POST"
			data : data

		r.done @getTweetsSuccess
		r.fail @getTweetsFail

		r

	getTweetsSuccess : (data) =>

		@tweetsRaw.add data.tweets

		crunch = @TD().appData.cruncher.crunch tweets : data.tweets

		crunch.done (data) ->

			console.log "CRUNCH DONE!!!"

		null

	getTweetsFail : (data) =>

		console.error "failed getting user tweets... ->", data

		null

	logout : (removeUser = false) =>

		endpoint = if removeUser then API.get('user.remove') else API.get('user.logout')

		r = Requester.request
			url  : endpoint
			type : "POST"

		r.done @onLogoutDone

		null

	removeUser : =>

		@logout true

		null

	onLogoutDone : =>

		window.location.href = @TD().BASE_PATH

		null

module.exports = UserData

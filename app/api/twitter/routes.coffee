creds      = require '../../creds'
twitter    = require 'twitter'
bodyParser = require 'body-parser'

getTweets = (req, res) ->

	# DEBUG!!!
	return res.json tweets : require './dummyData.json'

	tweets   = []
	# today    = new Date()
	# monthAgo = new Date(today.getFullYear(), today.getMonth()-1, today.getDate())

	target = 1000

	params =
		user_id          : req.body.user_id
		count            : 200
		include_entities : true

	twit = new twitter
		consumer_key        : creds.twitter.client_id
		consumer_secret     : creds.twitter.client_secret
		access_token_key    : req.body.token
		access_token_secret : req.body.tokenSecret

	callTwitter = (max_id=null) ->

		if max_id then params.max_id = max_id
		ret = false

		twit.get '/statuses/user_timeline.json', params, (data) ->

			console.log "calling twitter...? hello....? ", params

			# don't include reference tweet twice
			if data
				if max_id then data.shift()
			else
				res.json tweets : tweets

			for tweet in data
				target--
				# if new Date(tweet.created_at) > monthAgo
				if target >= 0
					tweets.push tweet
				else
					ret = true

			if ret
				res.json tweets : tweets
			else
				callTwitter data[data.length-1].id_str

	callTwitter()

setup = (app) ->

	app.use bodyParser()

	app.post '/api/twitter/getTweets', getTweets

module.exports = setup

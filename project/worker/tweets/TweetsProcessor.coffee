Abstract   = require '../Abstract'
TweetUtils = require '../utils/TweetUtils'

class TweetsProcessor extends Abstract

	rawTweets    : null
	noLinkTweets : null

	process : (@rawTweets) =>

		@noLinkTweets = TweetUtils.removeLinks @rawTweets

		(tweet.TW_PROCESSED = true) for tweet in @rawTweets

		@rawTweets

module.exports = TweetsProcessor

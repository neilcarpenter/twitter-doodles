Abstract         = require '../Abstract'
PreProcessTweets = require '../utils/PreProcessTweets'

class TweetsProcessor extends Abstract

	rawTweets    : null
	noLinkTweets : null

	process : (rawTweets) =>

		@rawTweets = JSON.parse JSON.stringify rawTweets

		# @noLinkTweets = PreProcessTweets.removeLinks @rawTweets

		(tweet.TW_PROCESSED = true) for tweet in @rawTweets

		@rawTweets

module.exports = TweetsProcessor

PreProcessTweets = require './utils/PreProcessTweets'
PostProcessArray = require './utils/PostProcessArray'

class Abstract

	rawTweets : null

	preProcess : (commands) =>

		tweets  = JSON.parse JSON.stringify @rawTweets
		(tweets = PreProcessTweets[command] tweets) for command in commands

		tweets

	postProcess : (data, commands) =>

		(data = PostProcessArray[command] data) for command in commands

		data

module.exports = Abstract

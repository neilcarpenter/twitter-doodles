Abstract   = require '../Abstract'
TweetUtils = require '../utils/TweetUtils'

class SampleProcessor extends Abstract

	rawTweets : null

	process : (@rawTweets) =>

		sampleData =
			chars :
				order : @_getCharsOrdered()
				count : ""
			words :
				order : @_getWordsOrdered()
				count : ""
			hashtags : ""
			mentions : ""

		sampleData

	_getCharsOrdered : =>

		tweets = @rawTweets.slice()
		tweets = TweetUtils.removeLinks tweets
		tweets = TweetUtils.unescape tweets
		tweets = TweetUtils.removeWhiteSpace tweets

		result = ''
		(result += tweet.text) for tweet in tweets
		result = result.split('')

		result

	_getWordsOrdered : =>

		tweets = @rawTweets.slice()
		tweets = TweetUtils.removeLinks tweets
		tweets = TweetUtils.unescape tweets

		result = ''
		(result += tweet.text) for tweet in tweets
		result = result.split(' ')

		result

module.exports = SampleProcessor

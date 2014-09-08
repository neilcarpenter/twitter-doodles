Abstract         = require '../Abstract'
PreProcessTweets = require '../utils/PreProcessTweets'
PostProcessArray = require '../utils/PostProcessArray'

class SampleProcessor extends Abstract

	rawTweets : null

	process : (rawTweets) =>

		@rawTweets = JSON.parse JSON.stringify rawTweets

		sampleData =
			chars :
				order : @_getCharsOrdered()
				count : ""
			words :
				order : @_getWordsOrdered()
				count : ""
			hashtags : 
				order : ""
				count : ""
			mentions : 
				order : ""
				count : ""

		sampleData

	preProcess : (commands) =>

		tweets  = JSON.parse JSON.stringify @rawTweets
		(tweets = PreProcessTweets[command] tweets) for command in commands

		tweets

	postProcess : (data, commands) =>

		(data = PostProcessArray[command] data) for command in commands

		data

	_getCharsOrdered : =>

		tweets = @preProcess [
			'removeLinks',
			'unescape',
			'removeExtraSpaces',
			'removeAllWhiteSpace'
		]

		result = ''
		(result += tweet.text) for tweet in tweets
		result = result.split('')

		result

	_getWordsOrdered : =>

		tweets = @preProcess [
			'removeLinks',
			'removeMentions',
			'unescape',
			'removeExtraSpaces',
			'removePunctuation',
			'removeQuotations',
			'toLowerCase'
		]

		result = ''
		(result += tweet.text) for tweet in tweets
		result = result.split(' ')

		result = @postProcess result, [
			'removeEmptyIndices',
			'removeAts'
		]

		result

module.exports = SampleProcessor

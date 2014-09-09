_ = require 'underscore'
Abstract         = require '../Abstract'
PreProcessTweets = require '../utils/PreProcessTweets'
PostProcessArray = require '../utils/PostProcessArray'

class SampleProcessor extends Abstract

	rawTweets : null

	process : (rawTweets) =>

		@rawTweets = JSON.parse JSON.stringify rawTweets

		charsChrono    = @_getCharsChrono()
		wordsChrono    = @_getWordsChrono()
		hashtagsChrono = @_getHashtagsChrono()
		mentionsChrono = @_getMentionsChrono()

		charsCounted    = @count charsChrono, 'char'
		wordsCounted    = @count wordsChrono, 'word'
		hashtagsCounted = @count hashtagsChrono, 'hashtag'
		mentionsCounted = @count mentionsChrono, 'mention'

		sampleData =
			chars :
				chrono : charsChrono
				counted :
					alpha : @sortAlpha charsCounted, 'char'
					count : @sortInt charsCounted
			words :
				chrono : wordsChrono
				counted :
					alpha : @sortAlpha wordsCounted, 'word'
					count : @sortInt wordsCounted
			hashtags :
				chrono : hashtagsChrono
				counted :
					alpha : @sortAlpha hashtagsCounted, 'hashtag'
					count : @sortInt hashtagsCounted
			mentions : 
				chrono : mentionsChrono
				counted :
					alpha : @sortAlpha mentionsCounted, 'mention'
					count : @sortInt mentionsCounted

		sampleData

	preProcess : (commands) =>

		tweets  = JSON.parse JSON.stringify @rawTweets
		(tweets = PreProcessTweets[command] tweets) for command in commands

		tweets

	postProcess : (data, commands) =>

		(data = PostProcessArray[command] data) for command in commands

		data

	count : (data, label) =>

		_result = {}
		result  = []

		(if _result[value] then _result[value]++ else _result[value] = 1) for value in data

		for name, count of _result
			val = count : count
			val[label] = name
			result.push val

		result

	sortAlpha : (data, label) =>

		data.sort (a, b) -> return a[label].localeCompare b[label]

		data

	sortInt : (data) =>

		data = _.sortBy(data, 'count').reverse()

		data

	_getCharsChrono : =>

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

	_getWordsChrono : =>

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

	_getHashtagsChrono : =>

		tweets = @preProcess []

		result = []

		((result.push '#'+hashtag.text) for hashtag in tweet.entities.hashtags) for tweet in tweets

		result

	_getMentionsChrono : =>

		tweets = @preProcess []

		result = []

		((result.push '@'+mention.screen_name) for mention in tweet.entities.user_mentions) for tweet in tweets

		result

module.exports = SampleProcessor

_                = require 'underscore'
url              = require 'url'
Abstract         = require '../Abstract'
PreProcessTweets = require '../utils/PreProcessTweets'
PostProcessArray = require '../utils/PostProcessArray'

class SampleProcessor extends Abstract

	rawTweets : null

	process : (rawTweets) =>

		@rawTweets = JSON.parse JSON.stringify rawTweets

		charsChrono     = @_getCharsChrono()
		wordsChrono     = @_getWordsChrono()
		hashtagsChrono  = @_getHashtagsChrono()
		mentionsChrono  = @_getMentionsChrono()
		sourcesChrono   = @_getSourcesChrono()
		linkHostsChrono = @_getLinkHostsChrono()
		placesChrono    = @_getPlacesChrono()

		charsCounted     = @count charsChrono, 'char'
		wordsCounted     = @count wordsChrono, 'word'
		hashtagsCounted  = @count hashtagsChrono, 'hashtag'
		mentionsCounted  = @count mentionsChrono, 'mention'
		sourcesCounted   = @count sourcesChrono, 'source'
		linkHostsCounted = @count linkHostsChrono, 'host'
		placesCounted    = @count placesChrono, 'place'

		sampleData =
			chars :
				chrono : charsChrono
				counted :
					alpha : @sortAlpha charsCounted, 'char'
					count : @sortCount charsCounted
			words :
				chrono : wordsChrono
				counted :
					alpha : @sortAlpha wordsCounted, 'word'
					count : @sortCount wordsCounted
			hashtags :
				chrono : hashtagsChrono
				counted :
					alpha : @sortAlpha hashtagsCounted, 'hashtag'
					count : @sortCount hashtagsCounted
			mentions : 
				chrono : mentionsChrono
				counted :
					alpha : @sortAlpha mentionsCounted, 'mention'
					count : @sortCount mentionsCounted
			sources :
				chrono : sourcesChrono
				counted :
					alpha : @sortAlpha sourcesCounted, 'source'
					count : @sortCount sourcesCounted
			linkHosts :
				chrono : linkHostsChrono
				counted :
					alpha : @sortAlpha linkHostsCounted, 'host'
					count : @sortCount linkHostsCounted
			places :
				chrono : placesChrono
				counted :
					alpha : @sortAlpha placesCounted, 'place'
					count : @sortCount placesCounted

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

	sortCount : (data) =>

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

		tweets = @rawTweets

		result = []

		((result.push '#'+hashtag.text) for hashtag in tweet.entities.hashtags) for tweet in tweets

		result

	_getMentionsChrono : =>

		tweets = @rawTweets

		result = []

		((result.push '@'+mention.screen_name) for mention in tweet.entities.user_mentions) for tweet in tweets

		result

	_getSourcesChrono : =>

		tweets = @rawTweets

		result = []

		(result.push tweet.source.replace(/<([^>]+)>/g, '')) for tweet in tweets

		result

	_getLinkHostsChrono : =>

		tweets = @rawTweets

		result = []

		((result.push url.parse(link.expanded_url).hostname) for link in tweet.entities.urls) for tweet in tweets

		result

	_getPlacesChrono : =>

		tweets = @rawTweets

		result = []

		(if tweet.place then result.push tweet.place.full_name) for tweet in tweets

		result

module.exports = SampleProcessor

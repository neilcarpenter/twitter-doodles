_                = require 'underscore'
url              = require 'url'
Abstract         = require '../Abstract'

class SampleProcessor extends Abstract

	labels : [
		'chars',
		'words',
		'hashtags',
		'mentions',
		'sources',
		'linkHosts',
		'places'
	]

	process : (rawTweets) =>

		@rawTweets = JSON.parse JSON.stringify rawTweets
		sampleData = {}

		for label in @labels

			chrono  = @["_get#{label.charAt(0).toUpperCase()+label.slice(1)}Chrono"]()
			counted = @count chrono, label.substring(0,label.length-1)

			sampleData[label] =
				chrono : chrono
				counted :
					alpha : @sortAlpha counted, label.substring(0,label.length-1)
					count : @sortCount counted

		sampleData

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

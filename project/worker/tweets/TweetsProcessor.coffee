_                = require 'underscore'
Abstract         = require '../Abstract'
PreProcessTweets = require '../utils/PreProcessTweets'

class TweetsProcessor extends Abstract

	processedTweets : null

	labels : [
		'chars',
		'words',
		'mentions',
		'hashtags',
		'media',
		'retweets',
		'favourites',
		'date'
	]

	process : (rawTweets) =>

		@rawTweets       = JSON.parse JSON.stringify rawTweets
		@processedTweets = []

		(@processedTweets.push id_str : tweet.id_str) for tweet in @rawTweets

		(@["_process#{label.charAt(0).toUpperCase()+label.slice(1)}"]()) for label in @labels

		@processedTweets

	_processChars : =>

		(@processedTweets[i].chars = tweet.text.length) for tweet, i in @rawTweets

		null

	_processWords : =>

		tweets = @preProcess [
			'removeLinks',
			'removeMentions',
			'unescape',
			'removeExtraSpaces',
			'removePunctuation',
			'removeQuotations',
			'toLowerCase'
		]

		(@processedTweets[i].words = tweet.text.split(' ').length) for tweet, i in tweets

		null

	_processMentions : =>

		(@processedTweets[i].mentions = tweet.entities.user_mentions) for tweet, i in @rawTweets

		null

	_processHashtags : =>

		(@processedTweets[i].hashtags = tweet.entities.hashtags) for tweet, i in @rawTweets

		null

	_processMedia : =>

		(@processedTweets[i].media = tweet.entities.media or []) for tweet, i in @rawTweets

		null

	_processRetweets : =>

		(@processedTweets[i].retweets = tweet.retweet_count) for tweet, i in @rawTweets

		null

	_processFavourites : =>

		(@processedTweets[i].favourites = tweet.favourite_count) for tweet, i in @rawTweets

		null

	_processDate : =>

		(@processedTweets[i].created_at = tweet.created_at) for tweet, i in @rawTweets

		null


module.exports = TweetsProcessor

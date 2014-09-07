_ = require 'underscore'

class TweetUtils

	@removeLinks = (tweets) =>

		for tweet in tweets

			if tweet.entities.urls

				for url in tweet.entities.urls

					tweet.text = tweet.text.replace url.url, ''

		tweets

	@unescape = (tweets) =>

		for tweet in tweets

			tweet.text = _.unescape tweet.text

		tweets

	@removeWhiteSpace = (tweets) =>

		for tweet in tweets

			tweet.text = tweet.text.replace /\s/g, ''

		tweets

module.exports = TweetUtils

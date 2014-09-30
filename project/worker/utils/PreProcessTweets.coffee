_ = require 'underscore'

class PreProcessTweets

	@re =
		url         : /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g
		mention     : /\B@[a-z0-9_-]+/gi
		whitespace  : /\s/g
		extraSpace  : /\s{2,}/g
		punctuation : /[\.,-\/%\^&\*\+;:{}=\-–\?_`~()><]/g # rewrite this - just do regex for everything that isn't a alphabetical character...
		commonChars : /[a-z0-9 _!*,#@"'\?\.\-]/gi

	@commonChars = 'abcdefghijklmnopqrstuvwxyz,.\'"!?$£#@*'.split('')

	@removeLinks = (tweets) =>

		for tweet in tweets

			for url in tweet.entities.urls

				tweet.text = tweet.text.replace url.url, ''

			# backup plan
			tweet.text = tweet.text.replace @re.url, ''

		tweets

	@removeMentions = (tweets) =>

		for tweet in tweets

			for mention in tweet.entities.user_mentions

				tweet.text = tweet.text.replace '@'+mention.screen_name, ''

			# backup
			tweet.text = tweet.text.replace @re.mention, ''

		tweets

	@unescape = (tweets) =>

		for tweet in tweets

			tweet.text = _.unescape tweet.text

		tweets

	@removeExtraSpaces = (tweets) =>

		for tweet in tweets

			tweet.text = tweet.text.replace @re.extraSpace, ' '

		tweets

	@removeAllWhiteSpace = (tweets) =>

		for tweet in tweets

			tweet.text = tweet.text.replace @re.whitespace, ''

		tweets

	@removePunctuation = (tweets) =>

		for tweet in tweets

			tweet.text = tweet.text.replace @re.punctuation, ''

		tweets

	@removeQuotations = (tweets) =>

		for tweet in tweets

			tweet.text = tweet.text.replace '"', ''

		tweets

	@toLowerCase = (tweets) =>

		for tweet in tweets

			tweet.text = tweet.text.toLowerCase()

		tweets

	@filterCommonChars = (tweets) =>

		for tweet in tweets

			allChars    = tweet.text.split('')
			filterChars = []

			(if @commonChars.indexOf(char) > -1 then filterChars.push(char)) for char in allChars

			tweet.text = filterChars.join('')

		tweets

module.exports = PreProcessTweets

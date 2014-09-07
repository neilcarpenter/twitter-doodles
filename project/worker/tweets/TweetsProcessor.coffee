class TweetsProcessor

	rawTweets : null

	process : (@rawTweets) =>

		(tweet.TW_PROCESSED = true) for tweet in @rawTweets

		@rawTweets

module.exports = TweetsProcessor

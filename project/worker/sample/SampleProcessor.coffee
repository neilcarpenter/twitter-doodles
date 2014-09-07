class SampleProcessor

	rawTweets : null

	process : (@rawTweets) =>

		(tweet.SA_PROCESSED = true) for tweet in @rawTweets

		@rawTweets

module.exports = SampleProcessor

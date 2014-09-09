SampleProcessor = require '../sample/SampleProcessor'
TweetsProcessor = require '../tweets/TweetsProcessor'

class Cruncher

	data            : null
	processedTweets : null

	sampleProcessor : null
	tweetsProcessor : null

	constructor : ->

		@sampleProcessor = new SampleProcessor
		@tweetsProcessor = new TweetsProcessor

		return null

	###
	/
	/ DATA CRUNCH
	/ @param data = { task_id(INT), [tweets] }
	/
	###
	crunch: (@data) =>

		@task_id = @data.task_id

		if !@data.tweets.length

			return self.send type: 'error', code: 1, data: JSON.stringify { task_id : @data.task_id }

		result =
			task_id     : @data.task_id
			timestamp   : @data.timestamp
			tweetsData  : @tweetsProcessor.process @data.tweets
			tweetsSample: @sampleProcessor.process @data.tweets

		self.send type: 'result', method: 'processTweets', data: JSON.stringify result

		null

module.exports = Cruncher

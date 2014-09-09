AbstractData = require './AbstractData'

class TweetCruncher extends AbstractData

	worker : null

	task_counter : 0
	dfds : {}

	buffer     : []
	inProgress : false

	ENV : if window.config.LIVE then 'production' else 'dev'

	DEPENDENCIES : {}

	constructor: ->

		super()

		@worker = new Worker "#{@TD().BASE_PATH}#{window.config.worker.url}"

		@setup()

		return null

	setup: =>

		@setEnvironment()
		@loadDependencies()

		@setupMessaging()
		@setupEvents()

		null

	setupMessaging: =>

		@worker.onmessage = (event) =>

			switch event.data.type

				when "console"

					console[event.data.action]( event.data.msg )

				when "result"

					@trigger 'result', method: event.data.method, result: JSON.parse event.data.data

				when "error"

					@trigger 'error', code: event.data.code, result: JSON.parse event.data.data

				else

					console.log 'unknown event - ', event

		null

	setupEvents: =>

		@on 'result', @onResult
		@on 'error', @onError

		null

	setEnvironment: =>

		@worker.postMessage
			type : 'setEnvironment'
			data : @ENV

		null
	
	loadDependencies: =>

		for name, url of @DEPENDENCIES

			@worker.postMessage
				type : 'loadDependency'
				data : url

		null

	_addToBuffer: (data) =>

		# console.log "_addToBuffer: (data) =>", data

		@buffer.push data
		@_processBuffer()

		@inProgress = true

		null

	_processBuffer: =>

		# console.log '_processBuffer', @buffer

		return unless !@inProgress and @buffer.length

		args = @buffer.shift()

		console.log "[worker] SEND ", JSON.parse(args.data).task_id

		@worker.postMessage args

		null

	###
	/
	/ Process all tweets
	/ @param data = { tweets : [tweets] }
	/
	###
	crunch: (data) =>

		data.task_id   = @task_counter++
		data.timestamp = Date.now()

		console.log "crunch: (data) => task_id = ", data.task_id
		# console.log "[worker] SEND ", data.task_id

		@_addToBuffer
			type : 'processTweets'
			data : JSON.stringify data

		@dfds[data.task_id] = $.Deferred()

	onResult: (data) =>

		time = Date.now() - data.result.timestamp

		console.log "Complete method #{data.method} - task_id = ", data.result.task_id, data.result
		console.log "[worker] RECEIVE in #{time}ms -- ", data.result.task_id

		@dfds[data.result.task_id]?.resolve data.result
		@dfds[data.result.task_id] = null
		delete @dfds[data.result.task_id]

		@inProgress = false
		@_processBuffer()

		null

	###
	/
	/ Error handling
	/
	/
	###
	onError: (data) =>

		console.error "Error on crunch - ID = ", data.result.task_id, data

		@dfds[data.result.task_id]?.reject data.code
		@dfds[data.result.task_id] = null
		delete @dfds[data.result.task_id]

		null

module.exports = TweetCruncher

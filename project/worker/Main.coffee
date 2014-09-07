Cruncher = require './cruncher/Cruncher'

self.send = if typeof workerPostMessage != 'undefined' then workerPostMessage else postMessage
cruncher  = new Cruncher

ENV = 'dev'

self.onmessage = (event) =>

	switch event.data.type

		when "loadDependency"

			importScripts event.data.data

		when "setEnvironment"

			ENV = event.data.data

		when "processTweets"

			cruncher.crunch JSON.parse event.data.data

	null

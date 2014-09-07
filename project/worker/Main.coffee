Test = require './test/Test'

send = if typeof workerPostMessage != 'undefined' then workerPostMessage else postMessage

@onmessage = (event) =>

	switch event.data.type

		when "loadDependency"

			importScripts event.data.data

		# when "setEnvironment"

		# 	ENV = event.data.data

		# when "setAlgoStructure"

		# 	ALGOS[event.data.site].structure = JSON.parse event.data.data
		# 	CRUNCHERS[event.data.site].setup()

		# when "setAlgoData"

		# 	ALGOS[event.data.site].data = JSON.parse event.data.data
		# 	CRUNCHERS[event.data.site].setup()

		# when "setCities"

		# 	STATS.location.setCities JSON.parse event.data.data

		# when "getCities"

		# 	STATS.location.getCities JSON.parse event.data.data

		# when "crunchTwitter"

		# 	CRUNCHERS.twitter.crunch JSON.parse event.data.data

		# when "crunchTweet"

		# 	CRUNCHERS.twitter.crunchSingleTweet JSON.parse event.data.data

		# when "crunchInstagram"

		# 	CRUNCHERS.instagram.crunch JSON.parse event.data.data

		# when "crunchFacebook"

		# 	CRUNCHERS.facebook.crunch JSON.parse event.data.data

		# when "crunchMerged"

		# 	CRUNCHERS.merged.crunch JSON.parse event.data.data

		# when "updateSiteStats"

		# 	STATS.site.update JSON.parse event.data.data

		# when "updateLocationStats"

		# 	STATS.location.update JSON.parse event.data.data

	null

AbstractData = require './data/AbstractData'
UserData     = require './data/UserData'
Requester    = require './utils/Requester'
API          = require './data/API'

class AppData extends AbstractData

	callback : null

	constructor : (@callback) ->

		@user = new UserData

		super()

		@getStartData()

		return null

	###
	get app bootstrap data - embed in HTML or API endpoint
	###
	getStartData : =>

		r = Requester.request
			url  : API.get('start')
			type : 'GET'

		r.done @onStartDataReceived
		r.fail =>

			# console.error "error loading api start data"

			###
			this is only temporary, while there is no bootstrap data here, normally would handle error / fail
			###
			@callback?()

		null

	onStartDataReceived : (data) =>

		###

		bootstrap data received, app ready to go

		###

		@callback?()

		null

module.exports = AppData

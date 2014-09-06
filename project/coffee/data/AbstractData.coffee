class AbstractData

	constructor : ->

		_.extend @, Backbone.Events

		return null

	TD : =>

		return window.TD

module.exports = AbstractData

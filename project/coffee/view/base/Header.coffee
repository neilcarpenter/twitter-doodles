AbstractView = require '../AbstractView'

class Header extends AbstractView

	template : 'site-header'

	events :
		'click [data-login]' : 'onLoginClick'

	constructor : ->

		@userData = @TD().appData.user
		@tmpl     = _.template @TD().templates.get @template

		@templateVars =
			desc : @TD().locale.get "header_desc"

		@templateVars = $.extend @templateVars, @userData.info.toJSON(), @userData.status.toJSON()

		super()

		@bindEvents()

		return null

	bindEvents : =>

		@userData.on @userData.EVENT_USER_LOGGED, @render

		null

	render : =>

		vars = $.extend @templateVars, @userData.info.toJSON(), @userData.status.toJSON()
		@$el.html @tmpl vars

		null

	onLoginClick : =>

		@TD().appData.user.login()

		null

module.exports = Header

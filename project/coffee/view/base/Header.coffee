AbstractView = require '../AbstractView'

class Header extends AbstractView

	template : 'site-header'

	events :
		'click [data-login]' : 'onLoginClick'

	constructor : ->

		@templateVars =
			desc : @TD().locale.get "header_desc"

		super()

		@setup()

		return null

	setup : =>

		window.$loginDfd = $.Deferred()
		window.$loginDfd.done @loginCallback
		window.$loginDfd.fail -> alert('there was an issue logging in...')

		null

	onLoginClick : =>

		url  = '/auth/twitter'
		w    = 680
		h    = 540
		left = ( screen.availWidth  - w ) >> 1
		top  = ( screen.availHeight - h ) >> 1
		opts = 'width=' + w + ',height=' + h + ',top=' + top + ',left=' + left + ',location=0,menubar=0,scrollbars=0,status=0,toolbar=0,resizable=0'

		window._loginWindow = window.open(url, 'loginWindow', opts)

		null

	loginCallback : (data) =>

		window._userData = data
		window._loginWindow.close()

		null

module.exports = Header

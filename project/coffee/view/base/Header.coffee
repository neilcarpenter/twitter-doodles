AbstractView = require '../AbstractView'

class Header extends AbstractView

	template : 'site-header'

	constructor : ->

		@templateVars =
			desc    : @TD().locale.get "header_desc"
			home    : 
				label    : 'Go to homepage'
				url      : @TD().BASE_PATH + '/' + @TD().nav.sections.HOME
			example : 
				label    : 'Go to example page'
				url      : @TD().BASE_PATH + '/' + @TD().nav.sections.EXAMPLE

		super()

		return null

module.exports = Header

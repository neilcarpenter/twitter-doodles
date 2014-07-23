class Header extends AbstractView

	template : 'site-header'

	constructor : ->

		@templateVars =
			desc    : @twd().locale.get "header_desc"
			home    : 
				label    : 'Go to homepage'
				url      : @twd().BASE_PATH + '/' + @twd().nav.sections.HOME
			example : 
				label    : 'Go to example page'
				url      : @twd().BASE_PATH + '/' + @twd().nav.sections.EXAMPLE

		super()

		return null

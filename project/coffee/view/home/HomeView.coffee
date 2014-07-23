class HomeView extends AbstractViewPage

	template : 'page-home'

	constructor : ->

		@templateVars = 
			desc : @twd().locale.get "home_desc"

		###

		instantiate classes here

		@exampleClass = new ExampleClass

		###

		super()

		###

		add classes to app structure here

		@
			.addChild(@exampleClass)

		###

		return null

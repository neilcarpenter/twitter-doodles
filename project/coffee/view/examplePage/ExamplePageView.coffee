class ExamplePageView extends AbstractViewPage

	template : 'page-example'

	constructor : ->

		@templateVars = 
			desc : @twd().locale.get "example_desc"

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

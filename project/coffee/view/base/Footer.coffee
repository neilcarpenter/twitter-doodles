class Footer extends AbstractView

    template : 'site-footer'

    constructor: ->

        @templateVars = 
        	desc : @twd().locale.get "footer_desc"

        super()

        return null

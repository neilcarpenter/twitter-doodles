AbstractView = require '../AbstractView'

class Footer extends AbstractView

    template : 'site-footer'

    constructor: ->

        @templateVars = 
        	desc : @TD().locale.get "footer_desc"

        super()

        return null

module.exports = Footer

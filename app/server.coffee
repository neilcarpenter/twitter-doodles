#!/usr/bin/env node
config  = require "./config"
express = require "express"
app     = express()

#Use whichever logging system you prefer.
#Doesn't have to be winston, I just wanted something more or less realistic
log = require("winston").loggers.get("app:server")

app.set "views", __dirname
app.engine 'html', require('ejs').renderFile
app.set 'view engine', 'html'

#Load the routes ("controllers" -ish)
[
	"./auth/twitter/routes",
	"./api/twitter/routes",
	"./site/routes"
].forEach (routePath) ->
	require(routePath)(app)

# put this after route definition, routes take priority
app.use(express.static(__dirname + '/public'))

#FINALLY, use any error handlers
app.use require("./middleware").notFound

#Note that there's not much logic in this file.
#The server should be mostly "glue" code to set things up and
#then start listening

app.listen config.express.port, config.express.ip, (error) ->
	if error
		log.error("Unable to listen for connections", error)
		process.exit(10)

	log.info("express is listening on " + config.BASE_PATH);

# Here's a set of routes for the full HTML pages on our site
_       = require 'underscore'
express = require 'express'
config  = require "../config"
content = require '../content/all.json'

home = (req, res) ->
	res.render "public/html/index", _.extend content.home, config : config

# about = (req, res) ->
# 	res.render "site/about"

setup = (app) ->
	app.get '/', home
	# app.get '/about', about

module.exports = setup

# Here's a set of routes for the full HTML pages on our site
_       = require 'underscore'
express = require 'express'
config  = require '../config'
creds   = require '../creds'
content = require '../content/all.json'

checkAuth = (req, res, next) ->
	if !req.session.logged_in
		res.redirect '/login'
	else
		next()

home = (req, res) ->
	res.render "public/html/index", _.extend content.home, config : config

login = (req, res) ->
	msg = if req.query.wrong_pw isnt undefined then 'Wrong. Try again' else false
	res.render "site/login", msg: msg

loginPost = (req, res) ->
	if req.body.pw is creds.password
		req.session.logged_in = true
		res.redirect '/'
	else
		res.redirect '/login?wrong_pw'

setup = (app) ->
	app.get '/login', login
	app.post '/login', loginPost
	app.all '*', checkAuth
	app.get '/', home

module.exports = setup

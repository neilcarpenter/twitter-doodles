class API

	@model : new APIRouteModel

	@getContants : =>

		### add more if we wanna use in API strings ###
		BASE_PATH : @twd().BASE_PATH

	@get : (name, vars) =>

		vars = $.extend true, vars, @getContants()
		return @supplantString @model.get(name), vars

	@supplantString : (str, vals) ->

		return str.replace /{{ ([^{}]*) }}/g, (a, b) ->
			r = vals[b] or if typeof vals[b] is 'number' then vals[b].toString() else ''
		(if typeof r is "string" or typeof r is "number" then r else a)

	@twd : =>

		return view.twd

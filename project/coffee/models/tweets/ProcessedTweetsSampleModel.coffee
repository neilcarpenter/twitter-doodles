AbstractModel = require '../AbstractModel'

###
	
format for X

> ARRAY - {{ X }} used in chronological order
chrono : ""

> ARRAYs - {{ X }} used and their frequency, sorted alphabetically / by frequency
counted :
	alpha : ""
	count : ""

###

class ProcessedTweetsSampleModel extends AbstractModel

	chars :
		chrono : ""
		counted :
			alpha : ""
			count : ""

	words :
		chrono : ""
		counted :
			alpha : ""
			count : ""

	hashtags :
		chrono : ""
		counted :
			alpha : ""
			count : ""

	mentions : 
		chrono : ""
		counted :
			alpha : ""
			count : ""

module.exports = ProcessedTweetsSampleModel

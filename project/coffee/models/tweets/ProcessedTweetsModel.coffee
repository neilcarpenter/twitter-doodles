AbstractModel = require '../AbstractModel'

class ProcessedTweetsModel extends AbstractModel

	defaults :

		# INT - string length of tweet
		length : ""

		# ARRAY - chars used, and their frequency
		chars : ""

		# ARRAY - words used, and their frequency
		words : ""

		# ARRAY
		mentions : ""

		# ARRAY
		hashtags : ""

		# ARRAY
		photos : ""

		# INT
		rt_count : ""

		# INT
		fav_count : ""

		# STR
		time : ""

		# STR
		date : ""

module.exports = ProcessedTweetsModel

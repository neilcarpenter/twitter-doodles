AbstractModel = require '../AbstractModel'

class ProcessedTweetsModel extends AbstractModel

	defaults :

		id_str : ""

		# INT - string length of tweet
		# length : ""

		# ARRAY - chars used, and their frequency
		chars : ""

		# ARRAY - words used, and their frequency
		words : ""

		# ARRAY
		mentions : []

		# ARRAY
		hashtags : []

		# ARRAY
		media : []

		# INT
		retweets : ""

		# INT
		favourites : ""

		# STR
		created_at : ""

module.exports = ProcessedTweetsModel

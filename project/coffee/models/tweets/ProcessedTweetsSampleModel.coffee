AbstractModel = require '../AbstractModel'

class ProcessedTweetsSampleModel extends AbstractModel

	chars :

		# ARRAY - chars used and their frequency
		count : ""

		# ARRAY - chars used, in order used
		order : ""

	words :

		# ARRAY - words used and their frequency
		count : ""

		# ARRAY - words used, in order used
		order : ""

	# hashtags used, and their frequency
	hashtags : ""

	# mentions used, and their frequency
	mentions : ""

module.exports = ProcessedTweetsSampleModel

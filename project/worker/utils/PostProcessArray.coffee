class PostProcessArray

	@re = null

	@removeEmptyIndices = (array) =>

		newArray = []

		for item in array

			if item isnt '' then newArray.push item

		newArray

	@removeAts = (array) =>

		newArray = []

		for item in array

			if item isnt '@' then newArray.push item

		newArray

module.exports = PostProcessArray

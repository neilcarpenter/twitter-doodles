AbstractCollection   = require '../AbstractCollection'
ProcessedTweetsModel = require '../../models/tweets/ProcessedTweetsModel'

class ProcessedTweetsCollection extends AbstractCollection

	model : ProcessedTweetsModel

module.exports = ProcessedTweetsCollection

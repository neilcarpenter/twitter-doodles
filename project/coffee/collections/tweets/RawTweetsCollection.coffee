AbstractCollection = require '../AbstractCollection'
RawTweetModel      = require '../../models/tweets/RawTweetModel'

class RawTweetsCollection extends AbstractCollection

	model : RawTweetModel

module.exports = RawTweetsCollection

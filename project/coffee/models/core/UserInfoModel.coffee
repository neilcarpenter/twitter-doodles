AbstractModel = require '../AbstractModel'

class UserInfoModel extends AbstractModel

	defaults :
		token       : ""
		tokenSecret : ""
		name        : ""
		id          : ""

module.exports = UserInfoModel

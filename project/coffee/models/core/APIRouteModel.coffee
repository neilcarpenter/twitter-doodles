class APIRouteModel extends Backbone.DeepModel

	defaults :

		start : "{{ BASE_PATH }}/api/start"

		locale : "{{ BASE_PATH }}/api/l10n/{{ code }}"

		getTweets : "{{ BASE_PATH }}/api/twitter/getTweets"

module.exports = APIRouteModel

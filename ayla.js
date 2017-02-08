const request = require("request");

module.exports = function(auth, on) {
	request.post({
		url: "https://ads-field.aylanetworks.com/apiv1/properties/18944260/datapoints.json",
		headers: {
			"Authorization": `auth_token ${auth}`,
			"Content-Type": "application/json"
		},
		json: true,
		body: {
			"datapoint": {
				"metadata": null,
				"value": on ? 1 : 0
			}
		}
	});
}
const request = require("request");

class ayla {
	constructor() {
		this.state = 0;
	}

	setState(auth, on) {
		this.state = on
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

	trigger(auth) {
		return () => {
			this.state = this.state ^ 1;
			this.setState(auth, this.state);
			return this.state ? "On" : "Off";
		}
	}
}

module.exports = ayla;

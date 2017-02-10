const request = require("request");
const nconf = require("nconf");

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
		this.state = this.state ^ 1;
		this.setState(auth, this.state);
		return this.state ? "On" : "Off";
	}

	renew() {
		return new Promise((resolve, reject) => {
			request.post({
				url: "https://user.aylanetworks.com/api/v1/token_sign_in.json",
				headers: {
					"Content-Type": "application/json"
				},
				json: true,
				body: {
					"app_id": nconf.get("AYLA_APP_ID"),
					"app_secret": nconf.get("AYLA_APP_SECRET"),
					"token": nconf.get("AYLA_APP_TOKEN"),
				}
			}, (err, response, body) => {
				if (err) {
					reject(err);
				} else {
					resolve(body.access_token);
				}
			});
		})
	}
}

module.exports = ayla;

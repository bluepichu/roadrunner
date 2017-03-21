/********************************
 *
 * RoadRunner for Raspberry Pi
 *
 * Matthew Savage and Zach Wade
 *
 ********************************/


import * as request from "request"
import * as nconf from "nconf"

export default class ayla {
	state: boolean;
	constructor() {
		this.state = false;
	}

	setState(auth: string, on: boolean) {
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

	trigger(auth: string): string {
		this.state = !this.state;
		this.setState(auth, this.state);
		return this.state ? "On" : "Off";
	}

	renew(): Promise<string> {
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

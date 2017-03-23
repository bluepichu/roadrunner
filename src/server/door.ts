"use strict";

import * as express     from "express";
import * as moment      from "moment";
import * as nconf       from "nconf";
import * as os          from "os";
import * as request     from "request";
import * as querystring from "querystring";
import * as uuid        from "uuid";

nconf.argv().env();

const CONSUMER_KEY    = "sVk3JJ04K2BlOk4zoVg3QLGhu2WqPkoS";
const CONSUMER_SECRET = nconf.get("CBORD_CONSUMER_SECRET");
const PORT            = nconf.get("port") || 8080;
const HOST            = os.hostname();

const REQUEST_TOKEN_URL   = "https://access.housing.cmu.edu//common/oauth/request_token.php";
const AUTHORIZE_TOKEN_URL = "https://access.housing.cmu.edu//common/oauth/authorize.php";
const ACCESS_TOKEN_URL    = "https://access.housing.cmu.edu//common/oauth/access_token.php";
const API_URL             = "https://access.housing.cmu.edu//common/goldapp/goldapp_fetch.php";

let CBORD_TOKEN = "";
let CBORD_TOKEN_SECRET = "";

let oauth_base = {
	consumer_key: CONSUMER_KEY,
	consumer_secret: CONSUMER_SECRET
};

export default function door(location: number): Promise<string> {
	let params = {
		action: "swipe",
		location,
		lat: 40.4454440 + Math.random() / 10000,
		lng: -79.9432430 + Math.random() / 10000,
		heading: -1.000000 + Math.random(),
		speed: -3.600000 + Math.random(),
		alt: 285.204742 + Math.random() / 1000,
		altacc: 10.754698 + + Math.random() / 100,
		acc: 65.000000 + Math.random() * 5,
		trandate: moment().format("YYYYMMDDHHmmss"),
		blesupport: "0"
	};

	return new Promise((resolve, reject) => {
		request.get({
			url: `${API_URL}?${querystring.stringify(params)}`,
			oauth: Object.assign({ token: CBORD_TOKEN, token_secret: CBORD_TOKEN_SECRET }, oauth_base)
		}, (err, resp, body) => {
			if (err) {
				reject(err);
			} else {
				resolve(body);
			}
		});
	}).then((body: string) => {
		let response = JSON.parse(body).Message;

		if (response === "Approved") {
			return "Approved";
		}

		let match = /\d{6}/.exec(response);
		if (match) {
			console.log(match[0]); // fallback
			return match[0];
		} else {
			throw body;
		}
	});
}

let secrets: { [key: string]: string } = {};

export function setAuthHooks(app: express.Express) {
	app.get("/token", (req, res) => {
		let id = uuid.v4();
		let callback = `http://${HOST}:${PORT}/auth`;

		new Promise((resolve, reject) => {
			request.post({
				url: REQUEST_TOKEN_URL,
				oauth: Object.assign({ callback }, oauth_base)
			}, (err, response, body) => {
				if (err) {
					reject(err);
				} else {
					resolve(body);
				}
			});
		}).then((body: string) => {
			let { oauth_token, oauth_token_secret } = querystring.parse(body);

			let params = {
				oauth_token,
				deviceid: id,
				app: "goldapp",
				trandate: moment().format("YYYYMMDDHHmmss"),
				oauth_callback: callback
			};

			secrets[oauth_token] = oauth_token_secret;

			res.redirect(`${AUTHORIZE_TOKEN_URL}?${querystring.stringify(params)}`)
		});
	});

	app.get("/auth", (req, res) => {
		if (req.query.oauth_verifier) {
			new Promise((resolve, reject) => {
				request.post({
					url: ACCESS_TOKEN_URL,
					oauth: Object.assign({
						token: req.query.oauth_token,
						token_secret: secrets[req.query.oauth_token],
						verifier: req.query.oauth_verifier
					}, oauth_base)
				}, (err, resp, body) => {
					if (err) {
						reject(err);
					} else {
						resolve(body);
					}
				});
			}).then((body: string) => {
				delete secrets[req.query.oauth_token];
				let {oauth_token, oauth_token_secret} = querystring.parse(body);
				CBORD_TOKEN = oauth_token;
				CBORD_TOKEN_SECRET = oauth_token_secret;

				res.send("Ok");
			});
		}
	});
}

/********************************
 *
 * RoadRunner for Raspberry Pi
 *
 * Matthew Savage and Zach Wade
 *
 ********************************/

import {
	Client,
	DefaultMediaReceiver
} from "castv2-client";

import scanner = require("chromecast-scanner");
import * as log from "beautiful-log";
import * as ip from "ip";
import * as nconf from "nconf"

nconf.argv().env()

const PORT = nconf.get("RRPORT") || 8080
const HOST = nconf.get("RRHOST") || ip.address()

function prm(obj: { [key: string]: Function }, fn: string, ...args: any[]): Promise<any> {
	return new Promise(function(resolve, reject) {
		args.push((err: any, data: any) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});

		obj[fn].apply(obj, args);
	});
}

export default function(path: string, type: string, level: number, timeout: number) {
	const media = {
		contentId: path.substring(0, 4) == "http" ? path : `http://${HOST}/${path}`,
		contentType: type,
		streamType: "LIVE"
	};
	console.log(media)

	return () => scanner((err, service) => {
		let client = new Client();

		new Promise((res, rej) => client.connect(service.data, (err) => err ? rej(err) : res()))
			.then(() => {
				log.info("Connected to cast!");

				client.launch(DefaultMediaReceiver, function(err, player) {
					let volume = 0;

					setTimeout(() => {
						prm(client, "setVolume", { level: volume })
							.then(() => {
								log.warn("Disconnecting from cast!");
								player.close();
							})
							.catch(log.error);
					}, timeout);

					prm(client, "getVolume")
						.then((vol) => {
							log.warn("Received volume", vol.level);
							volume = vol.level;
							return prm(client, "setVolume", { level });
						})
						.then(() => {
							log.warn("Playing doorbell sound");
							return prm(player, "load", media, { autoplay: true });
						})
						.catch(log.error);
				});

				client.on("error", function(err) {
					log.error("Error: %s", err.message);
					client.close();
				});
			})
			.catch(log.error);
	});
}

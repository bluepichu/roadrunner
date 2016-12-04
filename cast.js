const {
	Client,
	DefaultMediaReceiver
} = require("castv2-client");

const scanner = require("chromecast-scanner");
const log = require("beautiful-log");
const promisify = require("promisify-node");
const ip = require("ip");

function prm(obj, fn, ...args) {
	return new Promise(function(resolve, reject) {
		args.push((err, ...data) => {
			if (err) {
				reject(err);
			} else {
				resolve(...data);
			}
		});

		obj[fn].apply(obj, args);
	});
}

module.exports = function(path, type, level, timeout) {
	const media = {
		contentId: `http://${ip.address()}:8080/${path}`,
		contentType: type,
		streamType: "LIVE"
	};

	return () => scanner((err, service) => {
		let client = new Client();
		promisify(client);

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
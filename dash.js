const dash = require("node-dash-button");
const log = require("beautiful-log");

module.exports = function(mac, name, ...cbs) {
	let btn = dash(mac, null, null, "all");

	btn.on("detected", () => {
		log.info("Detected button press for", name);
		cbs.forEach((cb) => cb());
	});
}
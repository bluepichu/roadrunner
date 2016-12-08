const dash = require("node-dash-button");
const log = require("beautiful-log");

module.exports = function(mac string, name: string, cb): void {
	let btn: DashButton = dash(mac, null, null, "all");

	btn.on("detected", () => {
		log.info("Detected button press for", name);
		cb();
	});
}

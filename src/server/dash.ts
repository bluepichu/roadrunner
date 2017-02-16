import dash = require("node-dash-button");
import * as log from "beautiful-log";

export default function(mac: string, name: string, ...cbs: (() => void)[]): void {
	let btn = dash(mac, null, null, "all");

	btn.on("detected", () => {
		log.info("Detected button press for", name);
		cbs.forEach((cb) => cb());
	});
}


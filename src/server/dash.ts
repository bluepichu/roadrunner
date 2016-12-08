import dash from "node-dash-button";
import * as log from "beautiful-log";

export default function(mac: string, name: string, cb: () => void): void {
	let btn = dash(mac, null, null, "all");

	btn.on("detected", () => {
		log.info("Detected button press for", name);
		cb();
	});
}

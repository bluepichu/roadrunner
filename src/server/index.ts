/********************************
 *
 * RoadRunner for Raspberry Pi
 *
 * Matthew Savage and Zach Wade
 *
 ********************************/

import * as nconf from "nconf"

nconf.argv().env();

import dash from "./dash"
import aylaT from "./ayla"
import cast from "./cast"
import particleT from "./particle"
import delay from "./delay"

import * as log from "beautiful-log"
import * as staticServer from "node-static"
import * as http from "http"
import * as cp from "child_process"
import * as process from "process"
import * as schedule from "node-schedule"

const file     = new staticServer.Server("./public");
const ayla     = new aylaT();
const particle = particleT(nconf.get("PARTICLE_USER"), nconf.get("PARTICLE_PASS"));

let aylaAuth: string = null

http.createServer((req, res) => {
	req.addListener("end", () => {
		if (req.method === "POST" && req.url === "/lights/on") {
			ayla.setState(aylaAuth, true);
			res.write("On");
			res.end();
			return;
		} else if (req.method === "POST" && req.url === "/lights/off") {
			ayla.setState(aylaAuth, false);
			res.write("Off");
			res.end();
			return;
		} else if (req.method === "POST" && req.url === "/lights/trigger") {
			let state = ayla.trigger(aylaAuth);
			res.write(state);
			res.end();
			return;
		}

		if (req.method === "POST" && req.url === "/git-update") {
			log.ok("Received git update");
			res.writeHead(200, "OK");
			res.end();
			cp.execSync("su runner -c 'git reset --hard HEAD && git pull -f origin master && npm install'");
			process.exit();
		} else {
			log.log("Serving:", req.url);
			file.serve(req, res);
		}
	}).resume();
}).listen(8080);

let renew = () =>
	ayla.renew().then((d) => aylaAuth = d)

schedule.scheduleJob('0 0 4 * * *', renew)
renew()


delay(() => "boo", 12)

dash("a0:02:dc:3a:1c:ec", "ON", () => ayla.trigger(aylaAuth));
dash("44:65:0d:c5:6d:5f", "All", cast("doorbell.mp3", "audio/mp3", .75, 12000), particle("1f0039001047343339383037", "setPattern", "flash"), delay(particle("1f0039001047343339383037", "setPattern", "last"), 12000));

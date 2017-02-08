const nconf = require("nconf");

nconf.argv().env();

const dash = require("./dash");
const aylaT = require("./ayla");
const cast = require("./cast");
const particle = require("./particle")(nconf.get("PARTICLE_USER"), nconf.get("PARTICLE_PASS"));
const delay = require("./delay");

const log = require("beautiful-log");
const static = require("node-static");
const http = require("http");
const cp = require("child_process");
const process = require("process");

const file = new static.Server("./public");

const ayla = new aylaT();

http.createServer((req, res) => {
	req.addListener("end", () => {
		if (req.method === "POST" && req.url === "/lights/on") {
			ayla.setState(nconf.get("AYLA_AUTH_TOKEN"), true);
			res.write("On");
			res.end();
			return;
		} else if (req.method === "POST" && req.url === "/lights/off") {
			ayla.setState(nconf.get("AYLA_AUTH_TOKEN"), false);
			res.write("Off");
			res.end();
			return;
		} else if (req.method === "POST" && req.url === "/lights/trigger") {
			let state = ayla.trigger(nconf.get("AYLA_AUTH_TOKEN"))();
			res.write(state);
			res.end();
			return;
		}

		if (req.method === "POST" && req.url === "/git-update") {
			log.ok("Received git update");
			log.log(req.body);
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

console.log(ayla)
dash("a0:02:dc:3a:1c:ec", "ON", ayla.trigger(nconf.get("AYLA_AUTH_TOKEN")));
dash("44:65:0d:c5:6d:5f", "All", cast("doorbell.mp3", "audio/mp3", .75, 12000), particle("1f0039001047343339383037", "setPattern", "flash"), delay(particle("1f0039001047343339383037", "setPattern", "last"), 12000));

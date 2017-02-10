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
const schedule = require("node-schedule")

const file = new static.Server("./public");

const ayla = new aylaT();

let aylaAuth = null

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
		} else if (/*req.method === "POST" &&*/ req.url === "/lights/trigger") {
			let state = ayla.trigger(aylaAuth);
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

let renew = () =>
	ayla.renew().then((d) => aylaAuth = d)

schedule.scheduleJob('0 0 4 * * *', renew)
renew()


dash("a0:02:dc:3a:1c:ec", "ON", () => ayla.trigger(aylaAuth));
dash("44:65:0d:c5:6d:5f", "All", cast("doorbell.mp3", "audio/mp3", .75, 12000), particle("1f0039001047343339383037", "setPattern", "flash"), delay(particle("1f0039001047343339383037", "setPattern", "last"), 12000));

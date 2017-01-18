const nconf = require("nconf");

nconf.argv().env();

const dash = require("./dash");
const cast = require("./cast");
const particle = require("./particle")(nconf.get("PARTICLE_USER"), nconf.get("PARTICLE_PASS"));
const delay = require("./delay");

const log = require("beautiful-log");
const static = require("node-static");
const http = require("http");
const cp = require("child_process");
const process = require("process");

const file = new static.Server("./public");

http.createServer((req, res) => {
	req.addListener("end", () => {
		if (req.method === "POST" && req.url === "/git-update") {
			log.ok("Received git update");
			log.log(req.body);
			res.writeHead(200, "OK");
			res.end();
			cp.execSync("su runner -c 'git pull origin master && npm install'");
			process.exit();
		} else {
			log.log("Serving:", req.url);
			file.serve(req, res);
		}
	}).resume();
}).listen(8080);

dash("a0:02:dc:3a:1c:ec", "ON"); // Do nothing; used for local testing
dash("44:65:0d:c5:6d:5f", "All", cast("doorbell.mp3", "audio/mp3", .75, 12000), particle("1f0039001047343339383037", "setPattern", "flash"), delay(particle("1f0039001047343339383037", "setPattern", "last"), 4000));
"use strict";

import dash from "./dash";
import cast from "./cast";

import * as log from "beautiful-log";
import * as ns from "node-static";
import * as http from "http";
import * as cp from "child_process";
import * as process from "process";

const file = new ns.Server("./public");

http.createServer((req, res) => {
	req.addListener("end", () => {
		if (req.method === "POST" && req.url === "/git-update") {
			log.ok("Received git update");
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

dash("a0:02:dc:3a:1c:ec", "ON", cast("airhorn.mp3", "audio/mp3", .75, 12000));
dash("44:65:0d:c5:6d:5f", "All", cast("jingle-doorbell.mp3", "audio/mp3", .75, 12000));

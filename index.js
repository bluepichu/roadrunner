const dash = require("./dash");
const cast = require("./cast");

const log = require("beautiful-log");
const static = require("node-static");
const http = require("http");

const file = new static.Server("./public");

http.createServer((req, res) => {
	req.addListener("end", () => {
		log.log("Serving:", req.url);
		file.serve(req, res);
	}).resume();
}).listen(8080);

dash("a0:02:dc:3a:1c:ec", "ON", cast("jingle-doorbell.mp3", "audio/mp3", .75, 12000));
dash("44:65:0d:c5:6d:5f", "All", cast("jingle-doorbell.mp3", "audio/mp3", .75, 12000));
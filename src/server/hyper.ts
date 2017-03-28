import * as log from "beautiful-log"
import * as cp from "child_process";
import * as express from "express";
import * as path from "path";

import * as path from "path";

let app = express();

app.use(express.static(path.join(__dirname, "../../public")));

app.post("/git-update", (req, res) => {
	log.ok("Received git update");
	res.writeHead(200, "OK");
	res.end();
	cp.execSync("su runner -c 'git reset --hard HEAD && git pull -f origin master && npm install && gulp'");
	process.exit();
});

app.listen(8080);

export default app;

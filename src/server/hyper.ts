import * as log from "beautiful-log"
import * as cp from "child_process";
import * as express from "express";

let app = express();

app.use(express.static("../../public"));

app.post("/git-update", (req, res) => {
	log.ok("Received git update");
	res.writeHead(200, "OK");
	res.end();
	cp.execSync("su runner -c 'git reset --hard HEAD && git pull -f origin master && npm install && gulp'");
	process.exit();
});

app.listen(8080);

export default app;
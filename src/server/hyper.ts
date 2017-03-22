import * as http from "http"
import * as log from "beautiful-log"
import * as staticServer from "node-static"
import * as cp from "child_process"

const file = new staticServer.Server("./public");

class HyperAct {
	methods:Map<string, Map<string, ((req: http.ServerRequest, res: http.ServerResponse) => void)>> = new Map()
	constructor() {
		let ha = this

		http.createServer((req, res) => {
			req.addListener("end", () => {
				if (ha.methods.has(req.method) && ha.methods.get(req.method).has(req.url)) {
					ha.methods.get(req.method).get(req.url)(req, res)
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
	}
}

export interface methods {
	[name:string]: (url: string, ...opts: (() => any)[]) => any
	POST:          (url: string, ...opts: (() => any)[]) => any
	PUT:           (url: string, ...opts: (() => any)[]) => any
	GET:           (url: string, ...opts: (() => any)[]) => any
	HEAD:          (url: string, ...opts: (() => any)[]) => any
	DELETE:        (url: string, ...opts: (() => any)[]) => any
	OPTIONS:       (url: string, ...opts: (() => any)[]) => any
	CONNECT:       (url: string, ...opts: (() => any)[]) => any
}

let target = new HyperAct()

export let handler: methods = new Proxy({}, {
	"get": function(t: any, name: string | number | symbol): any {
		let field = name.toString()
		if (!target.methods.get(field)) {
			target.methods.set(field, new Map())
		}

		return function(url: string, ...opts: (() => any)[]) {
			target.methods.get(field).set(url, function(req, res) {
				try {
					let out = ""
					for (let fn of opts) {
						let res = fn()
						if (typeof res === "string") {
							out += res
						}
					}
					res.writeHead(200, "Ok")
					res.end(out)
				} catch (e) {
					res.writeHead(500, "Dunno Mate")
					res.end("Failed!")
				}
			})
		}
	}
})

declare module "node-static" {
	import { ServerRequest, ServerResponse } from 'http';
	import { Stats } from 'fs';

	export var version: number[];

	export class Server {
		constructor(path?: string, options?: ServerOptions);

		serveFile(filePath: string, status: number, headers: any, request: ServerRequest, response: ServerResponse): void;
		serveDir(dirPath: string, request: ServerRequest, response: ServerResponse, cb: FinishResponse): void;
		servePath(path: string, status: number, headers: any, request: ServerRequest, response: ServerResponse, cb: FinishResponse): void;
		resolve(path: string): void;
		serve(req: ServerRequest, res: ServerResponse, cb?: (err: Error, result: any) => void): void;
		gzipOk(req: ServerRequest, contentType: string): void;
		respondGzip(path: string, status: number, contentType: string, headers: any, files: string[], stat: Stats, req: ServerRequest, res: ServerResponse, finish: FinishResponse): void;
		respondNoGzip(path: string, status: number, contentType: string, headers: any, files: string[], stat: Stats, req: ServerRequest, res: ServerResponse, finish: FinishResponse): void;
		respond(path: string, status: number, headers: any, files: string[], stat: Stats, req: ServerRequest, res: ServerResponse, finish: FinishResponse): void;
		stream(path: string, files: string[], length: number, startByte: number, res: ServerResponse, cb?: (err: Error, offset: number) => void): void;
		parseByteRange(req: ServerRequest, stat: Stats): void;
		finish(status: number, headers: {}, req: ServerRequest, res: ServerResponse, promise: Promise<any>, cb?: (err: Error, result: any) => void): void;
	}

	interface FinishResponse {
		(status: number, headers: any): void;
	}

	interface ServerOptions {
		cache?: number;
		serverInfo?: string;
		headers?: any;
		gzip?: boolean | RegExp;
		indexFile?: string;
	}
}
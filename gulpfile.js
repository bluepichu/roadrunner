"use strict";

let es2015        = require("babel-preset-es2015");
let gulp          = require("gulp");
let path          = require("path");
let merge         = require("merge-stream");
let notifier      = require("node-notifier");
let $             = require("gulp-load-plugins")({ pattern: ["gulp-*", "gulp.*", "main-bower-files"] });

const SERVER_TS_CONFIG = {
	"emitDecoratorMetadata": true,
	"exprimentalDecorators": true,
	"target": "es6",
	"module": "commonjs",
	"moduleResolution": "node",
	"removeComments": true,
	"sourceMap": false,
	"noImplicitAny": true
};

const CLIENT_TS_CONFIG = {
	"emitDecoratorMetadata": true,
	"experimentalDecorators": true,
	"target": "es6",
	"moduleResolution": "node",
	"removeComments": true,
	"sourceMap": false,
	"noImplicitAny": true
};

const EXTERNAL_DEPENDENCY_LOOPUP = {
};

let src     = (...dirs) => dirs.map((dir) => path.join("src", dir));
let test    = (...dirs) => dirs.map((dir) => path.join("test", dir));
let build   = (dir) => path.join("build", dir);
let map     = "map";
let notify  = (message) => notifier.notify({
			title: "RoadRunner Build",
			message: message,
			icon: path.join(__dirname, "icon.gif")
		});

gulp.task("default", ["client", "server", "test"]);

gulp.task("watch", ["default", "watch-server", "watch-client", "watch-test"]);

gulp.task("watch-client", () => {
	gulp.watch(src("client/**/*.ts", "types/**/*.*", "common/**/*.*"), ["client-ts"]);
	gulp.watch(src("client/index.html"), ["client-html"]);
	gulp.watch(src("client/assets/**/*.*"), ["client-assets"]);
	gulp.watch(src("client/lib/*.js"), ["client-lib"]);
});

gulp.task("client", ["client-html", "client-assets", "client-ts", "client-lib"]);

gulp.task("client-assets", () =>
	gulp.src(src("client/assets/**/*.*"))
	    .pipe(gulp.dest(build("client/assets"))));

gulp.task("client-html", () =>
	gulp.src(src("client/index.html"))
	    .pipe(gulp.dest(build("client"))));

gulp.task("client-ts", () =>
	gulp.src(src("{client/ts/**/*.ts,common/**/*.ts}"))
	    .pipe($.sourcemaps.init())
	    .pipe($.typescript(CLIENT_TS_CONFIG))
	    .pipe($.sourcemaps.write(map))
	    .pipe($.ignore.exclude("*.map"))
	    .pipe($.sourcemaps.init({ loadMaps: true }))
	    .pipe($.sourcemaps.write(map))
	    .pipe($.replace(/import (\{.*\}) from '([^\s;]*)'/g, (_, target, source) => `const ${target} = ${EXTERNAL_DEPENDENCY_LOOPUP[source]}`))
	    .pipe($.replace(/import \* as ([^\s]*) from '([^\s;]*)'/g, (_, target, source) => `const ${target} = ${EXTERNAL_DEPENDENCY_LOOPUP[source]}`))
	    .pipe(gulp.dest(build("client/js"))
		.on("end", () => notify("The client is ready!"))));

gulp.task("client-lib", () =>
	gulp.src($.mainBowerFiles())
		.pipe($.sourcemaps.init({ loadMaps: true }))
		.pipe($.sourcemaps.write(map))
		.pipe(gulp.dest(build("client/lib"))));

gulp.task("watch-server", () => {
	gulp.watch(src("server/**/*.ts", "index.ts", "types/**/*.*", "common/**/*.*"), ["server"])
});

gulp.task("server", () =>
	gulp.src(src("{server/**/*.ts,index.ts,common/**/*.ts}"))
	    .pipe($.sourcemaps.init())
	    .pipe($.typescript(SERVER_TS_CONFIG))
	    .pipe($.sourcemaps.write(map))
	    .pipe(gulp.dest(build("")).on("end", () => notify("The server is ready!"))));

gulp.task("watch-test", () => {
	gulp.watch(test("**/*.ts"), ["test"]);
});

gulp.task("test", () =>
	gulp.src(test("**/*.ts"))
	    .pipe($.sourcemaps.init())
	    .pipe($.typescript(SERVER_TS_CONFIG))
	    .pipe($.replace("../../src/", "../../"))
	    .pipe($.sourcemaps.write(map))
	    .pipe(gulp.dest(build("test"))));

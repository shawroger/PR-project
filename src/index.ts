import * as path from "path";
import program from "commander";
import { runApp } from "./app";

program
	.version("0.0.1")
	.command("from <url> [dir]")
	.option("-r --relative", "true")
	.action((url, dir, cmd) => {
		if (url) {
			const publicDir = path.resolve(process.cwd(), dir ?? "download");
			console.log(
				`Download sources from ${url} in ${
					cmd.relative ? "relative" : "absolute"
				} mode at ${publicDir}`
			);
			runApp(url, publicDir, cmd.relative ? true : false);
		} else {
			console.log("Please input the site url to download source");
		}
	});

program.parse(process.argv);

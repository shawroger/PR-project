import path from "path";
import getPixels from "get-pixels";
import { startAnalysis } from "./core/analysis";
import { extractData } from "./core/deal-data";
import { runClassify } from "./core/classify";
import { drawOutline } from "./tip";

(function DealCommand() {
	const { question } = require("readline-sync");
	const command = question("Please input command: ");

	if (["analysis", "a"].includes(command)) {
		startAnalysis();
		console.log("图片像素信息分析完毕");
		question("Program end.");
	} else if (["classify", "c"].includes(command)) {
		const filePath =
			question("Please input the path of file: ") || "data/test.png";

		getPixels(path.resolve(process.cwd(), filePath), (err, pixel) => {
			if (err) {
				throw err;
			}

			console.log("Please waiting for the result ...");

			const data = extractData(Object.values(pixel.data));
			const result = runClassify(data);
			console.log(result);
			question("Program end.");
		});
	} else if (["draw", "d"].includes(command)) {
		const inPath = question("Please input the path of picture: ");
		const outPath = question("Please input the path of pixel Data: ");
		drawOutline(inPath || "data/test.png", outPath || "data/test.json");
		question("Program end.");
	} else {
		console.log("Unknown command!");
		question("Program end.");
	}

	
})();

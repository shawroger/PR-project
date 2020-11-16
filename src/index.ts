import path from "path";
import getPixels from "get-pixels";
import { startAnalysis } from "./core/analysis";
import { DealData } from "./core/deal-data";
import { runClassify } from "./core/classify";

function DealCommand() {
	const { question } = require("readline-sync");
	const command = question("Please input command: ");

	if (["analysis", "a"].includes(command)) {
		startAnalysis();
	} else if (["classify", "c"].includes(command)) {
		const filePath =
			question("Please input the path of file: ") || "data/test.png";

		getPixels(path.resolve(process.cwd(), filePath), (err, pixel) => {
			if (err) {
				throw err;
			}

			console.log("Please waiting for the result ...");

			const { data } = DealData.fromPixel(pixel);
			const result = runClassify(data);
			console.log(result);

			question("Program end.");
		});
	} else {
		console.log("Unknown command!");
		question("Program end.");
	}
}

export function Main(filePath: string) {
	return new Promise<
		{
			value: number;
			distance: number;
		}[]
	>((resolve, reject) => {
		getPixels(filePath, (err, pixel) => {
			if (err) {
				reject(err);
			}
			const { data } = DealData.fromPixel(pixel);
			const result = runClassify(data);
			resolve(result);
		});
	});
}

DealCommand();
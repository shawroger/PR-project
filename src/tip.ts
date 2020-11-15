import fse from "fs-extra";
import getPixels from "get-pixels";
import { extractData } from "./core/deal-data";

export function drawOutline(file: string, outFile: string) {
	getPixels(file, (err, pixel) => {
		if (err) {
			throw err;
		}

		const data = extractData(Object.values(pixel.data), pixel.shape[0]);
		fse.ensureFileSync(file);
		fse.ensureFileSync(outFile);
		fse.writeJSONSync(outFile, data);

		console.log(`File generate in ${outFile}`);
	});
}

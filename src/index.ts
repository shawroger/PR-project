import getPixels from "get-pixels";
import { DealData } from "./core/deal-data";
import { startAnalysis } from "./core/analysis";
import { runClassify } from "./core/classify";

export function Classify(filePath: string) {
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

export function Analysis() {
	startAnalysis();
}

export default {
	Analysis,
	Classify,
};

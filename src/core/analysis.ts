import fse from "fs-extra";
import getPixels from "get-pixels";
import { getCaptchaInfo } from "./info";
import { DealData } from "./deal-data";
import { Dir, DirNext } from "./path";

/**
 *
 * @param inFile 输入图片文件地址
 * @param outFile 输出像素数据地址
 */
export function useAnalysis(inFile: string, outFile: string) {
	getPixels(inFile, (err, pixel) => {
		if (err) {
			throw err;
		}

		const data = DealData.fromPixel(pixel);
		fse.ensureFileSync(outFile);
		fse.writeJSONSync(outFile, data.data);
	});
}

/***
 * 获取分析队列
 */
export function getAnalysisQueue() {
	/**
	 * 分析队列
	 */
	const queue: [string, string][] = [];
	/**
	 * 获取输入图片数据集
	 */
	const info = getCaptchaInfo();

	/**
	 * 清空并保证目录存在
	 */
	fse.ensureDirSync(Dir.pixel);
	fse.removeSync(Dir.pixel);

	info.forEach(({ value, address, filenames }) => {
		/**
		 * 查找子目录
		 */
		const pixelDir = DirNext.pixel(value);
		fse.ensureDirSync(pixelDir);
		/**
		 * 写入像素信息
		 */
		filenames.forEach((filename, index) => {
			const newName = filename.slice(0, filename.indexOf(".")).concat(".json");
			const pixelFile = DirNext.pixel(`${value}/${newName}`);
			queue.push([address[index], pixelFile]);
		});
	});

	return queue;
}
/**
 * 开始分析特征
 */
export function startAnalysis() {
	const queue = getAnalysisQueue();
	queue.forEach((v) => useAnalysis(...v));
}

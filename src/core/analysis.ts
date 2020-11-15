import fse from "fs-extra";
import getPixels from "get-pixels";
import { getCaptchaInfo } from "./info";
import { extractData } from "./deal-data";
import { Dir, DirNext } from "./path";

/**
 *
 * @param captchaFile 输入图片文件地址
 * @param pixelFile 输出像素数据地址
 */
export function useAnalysis(captchaFile: string, pixelFile: string) {
	getPixels(captchaFile, (err, pixel) => {
		if (err) {
			throw err;
		}

		const data = extractData(Object.values(pixel.data));
		fse.ensureFileSync(pixelFile);
		fse.writeJSONSync(pixelFile, data);
	});
}

/**
 * 开始分析特征
 */
export function startAnalysis() {
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
			useAnalysis(address[index], pixelFile);
		});
	});
}

import fse from "fs-extra";
import { Dir, DirNext } from "./path";


/**
 * 获取像素数据集目录信息
 */
export function getPixelInfo() {
	const info: Array<{
		value: string;
		address: Array<string>;
		filenames: Array<string>;
	}> = [];
	/**
	 * 读取 `data/json`内文件夹
	 */
	const mainDir = fse.readdirSync(Dir.pixel);
	mainDir.forEach((dir) => {
		const subDir = DirNext.pixel(dir);
		const innerFiles = fse.readdirSync(subDir);

		info.push({
			value: dir,
			filenames: innerFiles,
			address: innerFiles.map((file) => DirNext.pixel(`${dir}/${file}`)),
		});
	});

	return info;
}

/**
 * 获取验证码图片数据集目录信息
 */
export function getCaptchaInfo() {
	const info: Array<{
		value: string;
		address: Array<string>;
		filenames: Array<string>;
	}> = [];
	/**
	 * 读取 `data/captcha`内文件夹
	 */
	const mainDir = fse.readdirSync(Dir.captcha);
	mainDir.forEach((dir) => {
		const subDir = DirNext.captcha(dir);
		const innerFiles = fse.readdirSync(subDir);

		info.push({
			value: dir,
			filenames: innerFiles,
			address: innerFiles.map((file) => DirNext.captcha(`${dir}/${file}`)),
		});
	});

	return info;
}

import path from "path";

/**
 * 查找主目录
 */
export class Dir {
	/**
	 * return `data/captcha`
	 */
	static captcha = path.resolve(process.cwd(), "data/png");

	/**
	 * return `data/pixel`
	 */
	static pixel = path.resolve(process.cwd(), "data/json");
}

/**
 * 获取主目录下的子目录
 */
export class DirNext {
	static captcha(to: string) {
		return path.resolve(Dir.captcha, to);
	}

	static pixel(to: string) {
		return path.resolve(Dir.pixel, to);
	}
}

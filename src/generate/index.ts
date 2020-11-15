import fse from "fs-extra";
import Captcha from "captchapng";
import { Dir, DirNext } from "../core/path";

function initCaptcha(value: number) {
	const captcha = new Captcha(20, 20, value);
	captcha.color(0, 0, 0, 0);
	captcha.color(0, 0, 0, 255);
	return Buffer.from(captcha.getBase64(), "base64").toString("binary");
}

export function createPNG(fileNumbers: number = 50) {
	fse.ensureDirSync(Dir.captcha);
	for (let i = 0; i <= fileNumbers; i++) {
		const value = Math.floor(10 * Math.random());
		const mainDir = DirNext.captcha(value.toString());
		const buffer = initCaptcha(value);

		fse.ensureDirSync(mainDir);
		const fileCount = fse.readdirSync(mainDir).length;
		fse.writeFileSync(
			DirNext.captcha(`${mainDir}/${fileCount}.png`),
			buffer,
			"binary"
		);
	}
}

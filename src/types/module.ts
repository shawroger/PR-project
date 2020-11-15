declare module "captchapng" {
	export default class Captcha {
		constructor(width: number, height: number, value: number);

		color(color1: number, color2: number, color3: number, color4: number): void;

		getBase64(): string;
	}
}

declare module "get-pixels" {
	export interface Pixel {
		data: Uint8Array;
		shape: [number, number, number];
		stride: [number, number, number];
		offset: number;
	}
	export default function getPixels(
		url: string,
		callback: (err: NodeJS.ErrnoException, pixel: Pixel) => void
	): void;
}

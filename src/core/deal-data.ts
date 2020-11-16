import { Pixel } from "get-pixels";

/**
 * 判断像素颜色
 */
export class Color {
	/**
	 *
	 * @param color 代表颜色的四数元组
	 */
	constructor(public color: [number, number, number, number]) {}

	/**
	 * 是白色
	 */
	isWhite() {
		return (
			(this.color[0] === 255 &&
				this.color[1] === 255 &&
				this.color[2] === 255 &&
				this.color[3] === 255) ||
			(this.color[0] === 0 &&
				this.color[1] === 0 &&
				this.color[2] === 0 &&
				this.color[3] === 0)
		);
	}

	/**
	 * 是黑色 (RGBA = 0,0,0,255)
	 */
	isStrictBlack() {
		return (
			this.color[0] === 0 &&
			this.color[1] === 0 &&
			this.color[2] === 0 &&
			this.color[3] === 255
		);
	}

	/**
	 * 是黑色 (只看透明度)
	 */
	isAlphaBlack(limit = 255) {
		return (
			this.color[0] < limit &&
			this.color[1] < limit &&
			this.color[2] < limit &&
			this.color[3] === 255
		);
	}

	/**
	 * 颜色数据整合
	 * @param data 数据样本
	 */
	static combine(data: number[]) {
		const result: Array<[number, number, number, number]> = [];
		for (let i = 0; i <= data.length - 4; i = i + 4) {
			result.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
		}
		return result;
	}

	/**
	 * 直接代入颜色数据
	 * @param color 代表颜色的四数元组
	 */
	static with(color: [number, number, number, number]) {
		return new Color(color);
	}
}

export class DealData {
	/**
	 *
	 * @param pixel 像素整体数据
	 */
	static fromPixel(pixel: Pixel) {
		return new DealData(Object.values(pixel.data), pixel.shape[0]);
	}
	/**
	 *
	 * @param originData 原始一维数组
	 * @param width 图片宽度
	 */
	static from(originData: number[] | number[][], width = 28) {
		return new DealData(originData, width);
	}
	/**
	 * 矩阵化后的数据
	 */
	public data: number[][] = [];

	/**
	 * 颜色分组后的数据
	 */
	public colorData: Array<[number, number, number, number]> = [];

	/**
	 * 4*4分组后的数据
	 */
	public groupData: number[][][][] = [];

	/**
	 * 向量数据
	 */
	public vectorData: number[] = [];

	/**
	 * 弱向量数据
	 */
	public weakVectorData: number[] = [];

	/**
	 * 是否有原始数据
	 */
	public isOrigin = true;

	/**
	 *
	 * @param originData 原始数据
	 * @param width 数据边长
	 */
	constructor(public originData: number[] | number[][], width = 28) {
		if (Array.isArray(this.originData[0])) {
			this.data = this.originData as number[][];
			this.isOrigin = false;
		} else {
			this.data = this.extract(this.originData as number[], width);
		}
		this.groupData = this.group(this.data);
		this.vectorData = this.vector();
		this.weakVectorData = this.vector(this.weakGroup());
	}

	/**
	 * 压缩转化为正方形矩阵
	 * @param data 数据样本
	 */
	extract(data: number[], width: number) {
		const result: Array<number[]> = [];
		this.colorData = Color.combine(data);
		const group = this.colorData.map((v) =>
			Color.with(v).isStrictBlack() ? 1 : 0
		);
		for (let i = 0; i <= group.length - width; i = i + width) {
			const line: number[] = [];
			for (let j = 0; j < width; j++) {
				line.push(group[i + j]);
			}
			result.push(line);
		}

		return result;
	}

	/**
	 * 压缩转化为 16 块数组
	 * @param data 数据样本
	 */
	group(data: Array<number[]> = this.data) {
		const offset = data.length / 4;
		const result: Array<number[][][]> = [];
		const subResult: Array<number[][]> = [];

		for (let i = 0; i < data.length; i = i + offset) {
			subResult.push(data.slice(i, i + offset));
		}

		for (let i = 0; i < data.length; i = i + offset) {
			const subArr = subResult.map((item) =>
				item.map((v) => v.slice(i, i + offset))
			);
			result.push(subArr);
		}

		return result;
	}

	/**
	 * 压缩转化为 16 块数组
	 * @param data 数据样本
	 */
	weakGroup(data: Array<number[]> = this.data) {
		const offset = data.length / 2;
		const result: Array<number[][][]> = [];
		const subResult: Array<number[][]> = [];

		for (let i = 0; i < data.length; i = i + offset) {
			subResult.push(data.slice(i, i + offset));
		}

		for (let i = 0; i < data.length; i = i + offset) {
			const subArr = subResult.map((item) =>
				item.map((v) => v.slice(i, i + offset))
			);
			result.push(subArr);
		}

		return result;
	}

	/**
	 * 直接转化为 16 位向量
	 * @param data 数据样本
	 */
	vector(groupData = this.groupData) {
		const result: number[] = [];
		for (let i = 0; i < groupData.length; i++) {
			for (let j = 0; j < groupData[0].length; j++) {
				let counter = 0;
				const chunk = groupData[i][j];
				for (let ii = 0; ii < chunk.length; ii++) {
					for (let jj = 0; jj < chunk[0].length; jj++) {
						if (chunk[ii][jj] === 1) {
							counter++;
						}
					}
				}
				result.push(counter);
			}
		}
		return result;
	}
}

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
	 * 是黑色
	 */
	isBlack() {
		return (
			this.color[0] === 0 &&
			this.color[1] === 0 &&
			this.color[2] === 0 &&
			this.color[3] === 255
		);
	}

	/**
	 * 直接代入颜色数据
	 * @param color 代表颜色的四数元组
	 */
	static with(color: [number, number, number, number]) {
		return new Color(color);
	}
}

/**
 * 4-4分组
 * @param data 数据样本
 */
export function groupData(data: number[]) {
	const result: Array<[number, number, number, number]> = [];
	for (let i = 0; i <= data.length - 4; i = i + 4) {
		result.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
	}
	return result;
}

/**
 * 压缩转化为 20*20 数组
 * @param data 数据样本
 */
export function extractData(data: number[], width = 20) {
	const result: Array<number[]> = [];
	const group = groupData(data).map((v) => (Color.with(v).isBlack() ? 1 : 0));
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
 * 统计每块数组中 1 的个数，返回一个相应位向量
 * @param groupData 输入已分组数组
 */
export function countGroup(groupData: number[][][][]) {
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

/**
 * 压缩转化为 16 块 5*5 数组
 * @param data 数据样本
 */
export function group16(data: Array<number[]>) {
	const offset = 5;
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
 * 压缩转化为 4 块 10*10 数组
 * @param data 数据样本
 */
export function group4(data: Array<number[]>) {
	const offset = 10;
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
 * 统计每一行中 1 的个数
 * @param data 数据样本
 */
export function countByRows(data: Array<number[]>) {
	const result: number[] = [];

	data.forEach((arr) => {
		let counter = 0;
		for (let value of arr) {
			if (value === 1) {
				counter++;
			}
		}
		result.push(counter);
	});

	return result;
}

/**
 * 转置二维数组
 * @param data 二维数组
 */
export function transposit(data: Array<number[]>) {
	const result: Array<number[]> = [];
	for (let i = 0; i < data[0].length; i++) {
		const row: number[] = [];
		for (let j = 0; j < data.length; j++) {
			row.push(data[j][i]);
		}

		result.push(row);
	}

	return result;
}

/**
 * 统计每一列中 1 的个数
 * @param data 数据样本
 */
export function countByCols(data: Array<number[]>) {
	return countByRows(transposit(data));
}

/**
 * 直接转化为 16 位向量
 * @param data 数据样本
 */
export const vector16 = (data: Array<number[]>) => countGroup(group16(data));

/**
 * 直接转化为 4 位向量
 * @param data 数据样本
 */
export const vector4 = (data: Array<number[]>) => countGroup(group4(data));

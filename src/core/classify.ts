import fse from "fs-extra";
import { countByCols, countByRows, vector16, vector4 } from "./deal-data";
import { getPixelInfo } from "./info";

/**
 * 距离计算
 */
class Distance {
	/**
	 *
	 * @param data 输入的数据
	 * @param sample 数据集数据
	 */
	constructor(public data: Array<number[]>, public sample: Array<number[]>) {}

	/**
	 * 欧氏距离计算公式
	 * @param a 数据A
	 * @param b 数据B
	 */
	getDistance(a: number[], b: number[]) {
		return Array(a.length)
			.fill(0)
			.map((_, k) => a[k] - b[k])
			.reduce((pre, cur) => pre + cur * cur, 0);
	}

	/**
	 * 4位向量计算
	 */
	vector4() {
		return this.getDistance(vector4(this.data), vector4(this.sample));
	}

	/**
	 * 16位向量计算
	 * 
	 * 最推荐距离计算方法
	 */
	vector16() {
		return this.getDistance(vector16(this.data), vector16(this.sample));
	}

	/**
	 * 各行作为向量计算
	 */
	row() {
		return this.getDistance(countByRows(this.data), countByRows(this.sample));
	}

	/**
	 * 各列作为向量计算
	 */
	col() {
		return this.getDistance(countByCols(this.data), countByCols(this.sample));
	}

	/**
	 * 各列、各行作为向量计算
	 * @param weight 行的权重
	 */
	rowAndCol(weight = 0.5) {
		return weight * this.row() + (1 - weight) * this.col();
	}
}
/**
 * 开始分类
 * @param data 输入数据
 * @param decimal 保留小数位
 */
export function runClassify(data: Array<number[]>, decimal = 1) {
	const result: Array<{
		value: number;
		distance: number;
	}> = [];
	/**
	 * 获取数据集数据
	 */
	const info = getPixelInfo();

	info.forEach(({ value, address }) => {
		/**
		 * 对每个 `value` 计算一个距离
		 */
		let distance = 0;

		/**
		 * 对每个数据集数据的距离相加
		 */
		address.forEach((file) => {
			const sample = fse.readJSONSync(file) as Array<number[]>;
			const distanceAdder = new Distance(data, sample).vector16();
			distance += distanceAdder;
		});

		/**
		 * 取平均值，保留小数
		 */
		distance =
			Math.ceil((10 ** decimal * distance) / address.length) / 10 ** decimal;

		result.push({
			value: parseInt(value),
			distance,
		});
	});

	/**
	 * 按照距离大小排序
	 */
	return result.sort((a, b) => a.distance - b.distance);
}

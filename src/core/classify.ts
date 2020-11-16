import fse from "fs-extra";
import { DealData } from "./deal-data";
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

	vector() {
		return this.getDistance(
			DealData.from(this.data).vectorData,
			DealData.from(this.sample).vectorData
		);
	}

	weakVector() {
		return this.getDistance(
			DealData.from(this.data).weakVectorData,
			DealData.from(this.sample).weakVectorData
		);
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
			const distanceAdder = new Distance(data, sample).vector();
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

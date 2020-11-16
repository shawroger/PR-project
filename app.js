const { question } = require("readline-sync");
const { Analysis, Classify } = require("./dist/index");

(() => {
	const command = question("Please input command: ");
	switch (command) {
		case "a": {
			Analysis();
			question("图片像素信息分析完毕");
			break;
		}

		case "c": {
			const filePath =
				question("Please input the path of file: ") || "data/test.png";
			Classify(filePath).then((data) => console.log(data));
			break;
		}

		default: {
			console.log("Unknown command!");
			question("Program end.");
		}
	}
})();

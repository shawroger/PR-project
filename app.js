const { question } = require("readline-sync");
const { Analysis, Classify } = require("./dist/index");

(() => {
	const command = question("Please input command: ");
	switch (command) {
		case "a": {
			Analysis();
			question("Analysis finished.");
			break;
		}

		case "c": {
			Classify(
				question("Please input the path of file: ") || "data/test.png"
			).then((data) => {
				console.log(data);
				question("Classify over.");
			});

			break;
		}

		default: {
			console.log("Unknown command!");
			question("Program end.");
		}
	}
})();

const events = require("events");
const fs = require("fs");
const readline = require("readline");

function readFalsePositiveData() {
    const falsePositiveData = [];
    let first = true;
    let arr;

    return new Promise(function (resolve, reject) {

        try {
            const rl = readline.createInterface({
                input: fs.createReadStream("FalsePositive.csv"),
                crlfDelay: Infinity
            });

            rl.on("line", (line) => {
                const item = {};
                if (first) {
                    first = false;
                }
                else {
                    arr = line.split(",");
                    item.sampleSet = arr[0];
                    item.words = arr.splice(1);
                    falsePositiveData.push(item);
                }
            });

            events.once(rl, "close")
                .then(() => {
                    resolve(falsePositiveData);
                });
        } catch (err) {
            reject(err);
        }
    });
}

(async () => {
    const data = await readFalsePositiveData();
    console.log(data[0], data[1]);
})();


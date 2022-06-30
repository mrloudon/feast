const events = require("events");
const fs = require("fs");
const readline = require("readline");

function readSampleData() {
    const cataData = [];
    let first = true;
    let arr;

    return new Promise(function (resolve, reject) {

        try {
            const rl = readline.createInterface({
                input: fs.createReadStream("SampleOrder.csv"),
                crlfDelay: Infinity
            });

            rl.on("line", (line) => {
                const item = {};
                if (first) {
                    first = false;
                }
                else {
                    arr = line.split(",");
                    item.subject = arr[0];
                    item.samples = arr.splice(1);
                    cataData.push(item);
                }
            });

            events.once(rl, "close")
                .then(() => {
                    resolve(cataData);
                });
        } catch (err) {
            reject(err);
        }
    });
}

(async () => {
    const data = await readSampleData();
    console.log(data[0], data[100]);
})();
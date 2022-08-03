const events = require("events");
const fs = require("fs");
const readline = require("readline");

function readIntensionData() {
    const cataData = [];
    let arr;

    return new Promise(function (resolve, reject) {

        try {
            const rl = readline.createInterface({
                input: fs.createReadStream("intension.csv"),
                crlfDelay: Infinity
            });

            rl.on("line", (line) => {
                arr = line.split(",");
                cataData.push(arr);
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
    const data = await readIntensionData();
    console.log(data[0]);
})();
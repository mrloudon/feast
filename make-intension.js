
const fs = require("fs");
const readline = require("readline");
const events = require("events");

const INFILE = "emotion_cata_1.csv";
const OUTFILE = "intension.csv";

function readCataData() {
    const cataData = [];
    let first = true;
    let arr;

    return new Promise(function (resolve, reject) {

        try {
            const rl = readline.createInterface({
                input: fs.createReadStream(INFILE),
                crlfDelay: Infinity
            });

            rl.on("line", (line) => {
                if (first) {
                    first = false;
                }
                else {
                    arr = line.split(",");
                    cataData.push(arr.splice(1));
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
    let block, i, j;
    let header = "Participant,";
    const data = await readCataData();
    const outStream = fs.createWriteStream(OUTFILE, { flags: "w" });

    for (i = 0; i < data[0].length * 2; i++) {
        header += `Word ${i + 1},`;
    }
    outStream.write(header.slice(0, -1) + "\n");

    console.log(`Read ${data.length} CATA records.`);
    for (i = 0; i < data.length; i++) {
        do {
            j = Math.floor(Math.random() * data.length);
        } while (j === i);
        block = data[i].concat(data[j]);
        outStream.write(`${i + 1},${block.join(",")}\n`);
    }
    outStream.end();
    console.log("Done.");
})();

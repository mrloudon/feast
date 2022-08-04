/* eslint-env node */

const express = require("express");
const fs = require("fs");
const events = require("events");
const readline = require("readline");

const PILOT_OUTPUT_FILE =   "./public/A3rgYo56weW.csv";
const DEMO_OUTPUT_FILE =    "./public/ChSgHo1TwE.csv";
const HCD_OUTPUT_FILE =     "./public/jWScUE44eR.csv";

const app = express();
const port = 8010
let emotionCataData, sensoryCataData, falsePositiveData, sampleData, intensionData;

function constructHcdCSVHeader(){

    function makeIntensionCsvHeader(sampleNumber) {
        const emotionWords = [
            "Adventurous",
            "Bored",
            "Cheap",
            "Classy",
            "Comforted",
            "Energised",
            "Feminine",
            "Genuine",
            "Happy",
            "Inspired",
            "Irritated",
            "Masculine",
            "Modern",
            "Pretentious",
            "Relaxed",
            "Sensual",
            "Simple",
            "Sophisticated",
            "Traditional",
            "Uninspired"
        ];
        let intensionCSV = "";
        emotionWords.forEach(word => {
            intensionCSV += `${sampleNumber}-1 ${word},${sampleNumber}-2 ${word},`;
        });
    
        return intensionCSV.slice(0,-1);
    }

    const intension1HeaderCSV = makeIntensionCsvHeader("1");
    const intension2HeaderCSV = makeIntensionCsvHeader("2");
    const intension3HeaderCSV = makeIntensionCsvHeader("3");
    const intension4HeaderCSV = makeIntensionCsvHeader("4");
    const intension5HeaderCSV = makeIntensionCsvHeader("5");

    let headerCSV = `"Date","Time","IP","ID","Session","Sequence","S1","S2","S3","S4","S5",`;
    headerCSV += `"RTs","Mean","SD",`;
    headerCSV += `"Hits","Misses","CR","FA","Hits","Misses","CR","FA",`;
    headerCSV += `"Sample 1","Liking 1",${intension1HeaderCSV},"Emotion CATA 1","Sensory CATA 1",`;
    headerCSV += `"Sample 2","Liking 2",${intension2HeaderCSV},"Emotion CATA 2","Sensory CATA 2",`;
    headerCSV += `"Sample 3","Liking 3",${intension3HeaderCSV},"Emotion CATA 3","Sensory CATA 3",`;
    headerCSV += `"Sample 4","Liking 4",${intension4HeaderCSV},"Emotion CATA 4","Sensory CATA 4",`;
    headerCSV += `"Sample 5","Liking 5",${intension5HeaderCSV},"Emotion CATA 5","Sensory CATA 5"`;
    headerCSV += "\n";
    return headerCSV;
} 

function constructPilotCSVHeader() {
    //const words = ["Satisfied", "Comforted", "Happy", "Indulgent", "Pleasant", "Nostalgic", "Bored", "Disappointed", "Disgusted", "Relaxed", "Uncomfortable", "Delight"];
    const words = ["Satisfied", "Comforted", "Happy", "Indulgent", "Pleasant"];
    let headerCSV = `"Date","Time","IP","ID","Word order"`;

    function makeBlock(block) {
        headerCSV += `,"Click time 1${block}","Completed time 1${block}","Selection 1${block}"`;
        words.forEach(word => {
            headerCSV += `,"Timeout 2${block} - ${word}","RT 2${block}- ${word}","Response 2${block} - ${word}"`;
        });
        words.forEach(word => {
            headerCSV += `,"Timeout 3${block} - ${word}","RT 3${block}- ${word}","Response 3${block} - ${word}"`;
        });
    }

    makeBlock("A");
    makeBlock("B");
    makeBlock("C");
    headerCSV += "\n";
    return headerCSV;
}

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


function readCataData(fName) {
    const cataData = [];
    let first = true;
    let arr;

    return new Promise(function (resolve, reject) {

        try {
            const rl = readline.createInterface({
                input: fs.createReadStream(fName),
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
                    item.cata = arr.splice(1);
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


app.use(express.json());
app.disable("x-powered-by");
app.use(express.static("public"));

app.get("/hi", (req, res) => {
    res.send('Hello World!');
});

app.get("/emotionCata", (req, resp) => {
    const id = parseInt(req.query.id, 10);
    if(!isNaN(id) && id >= 0 && id < (sampleData.length + 1)){
        resp.send(emotionCataData[id - 1]);
    }
    else{
        resp.statusMessage = `Bad ID: ${id}`;
        resp.status(400).end();
    }
});

app.get("/sensoryCata", (req, resp) => {
    const id = parseInt(req.query.id, 10);
    if(!isNaN(id) && id >= 0 && id < (sampleData.length + 1)){
        resp.send(sensoryCataData[id - 1]);
    }
    else{
        resp.statusMessage = `Bad ID: ${id}`;
        resp.status(400).end();
    }
});

app.get("/intension", (req, resp) => {
    const id = parseInt(req.query.id, 10);
    if(!isNaN(id) && id >= 0 && id < (sampleData.length + 1)){
        resp.send(intensionData[id].slice(1));
    }
    else{
        resp.statusMessage = `Bad ID: ${id}`;
        resp.status(400).end();
    }
});

app.get("/samples", (req, resp) => {
    resp.send(sampleData);
});

app.get("/falsePositives", (req, resp) => {
    const id = parseInt(req.query.id, 10);
    if(!isNaN(id)){
        resp.send([falsePositiveData[id * 2 - 2], falsePositiveData[id * 2 - 1]]);
    }
    else{
        resp.statusMessage = `Bad ID: ${id}`;
        resp.status(400).end();
    }
});


app.post(["/submit", "/feast/submit"], (req, resp) => {
    const dt = new Date();
    const ip = req.headers["x-forwarded-for"] || req.ip;

    function writeCSV(csv) {
        fs.appendFile(DEMO_OUTPUT_FILE, csv, () => { });

        /* fs.stat(OUTPUT_FILE, function (err, stat) {
            if (err === null) {
                fs.appendFile(OUTPUT_FILE, csv, () => { });
            }
            else {
                constructCSVHeader();
                //console.log(CSV_HEADER);
                fs.writeFileSync(OUTPUT_FILE, CSV_HEADER);
                fs.appendFile(OUTPUT_FILE, csv, () => { });
            }
        }); */
    }

    writeCSV(`${dt.toLocaleString()},${ip},${req.body.csv}\n`);
    resp
        .status(200)
        .contentType("text/plain")
        .end("OK");
});

app.post(["/submitPilot", "/feast/submitPilot"], (req, resp) => {
    const dt = new Date();
    const ip = req.headers["x-forwarded-for"] || req.ip;

    function writeCSV(csv) {
        fs.stat(PILOT_OUTPUT_FILE, function (err) {
            if (err === null) {
                fs.appendFile(PILOT_OUTPUT_FILE, csv, (err) => {
                    if (err) {
                        console.log("Error writing csv:", err);
                    }
                });
            }
            else {
                const csvHeader = constructPilotCSVHeader();
                console.log(csvHeader);
                fs.writeFileSync(PILOT_OUTPUT_FILE, csvHeader);
                fs.appendFile(PILOT_OUTPUT_FILE, csv, () => { });
            }
        });
    }

    writeCSV(`${dt.toLocaleString()},${ip},${req.body.csv}\n`);
    resp
        .status(200)
        .contentType("text/plain")
        .end("OK");
});

app.post(["/submitHCD", "/feast/submitHCD"], (req, resp) => {
    const dt = new Date();
    const ip = req.headers["x-forwarded-for"] || req.ip;

    function writeCSV(csv) {
        fs.stat(HCD_OUTPUT_FILE, function (err) {
            if (err === null) {
                fs.appendFile(HCD_OUTPUT_FILE, csv, (err) => {
                    if (err) {
                        console.log("Error writing HCD csv:", err);
                    }
                });
            }
            else {
                const csvHeader = constructHcdCSVHeader();
                //console.log(csvHeader);
                fs.writeFileSync(HCD_OUTPUT_FILE, csvHeader);
                fs.appendFile(HCD_OUTPUT_FILE, csv, () => { });
            }
        });
    }

    writeCSV(`${dt.toLocaleString()},${ip},${req.body.csv}\n`);
    resp
        .status(200)
        .contentType("text/plain")
        .end("OK");
});

(async () => {
    try {
        sampleData = await readSampleData();
        console.log("Sample data read.");
        emotionCataData = await readCataData("emotion_cata_1.csv");
        console.log("Emotion CATA data read.");
        sensoryCataData = await readCataData("sensory_cata_1.csv");
        console.log("Sensory CATA data read.");
        falsePositiveData = await readFalsePositiveData();
        console.log("False positive data read.");
        intensionData = await readIntensionData();
        console.log("Intension data read.");
        app.listen(port, () => {
            console.log(`Feast server listening locally at http://localhost:${port}`)
        });
    }
    catch (err) {
        console.log(err);
    }
})();


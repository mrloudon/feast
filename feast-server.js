/* eslint-env node */

const express = require("express");
const fs = require("fs");

const PILOT_OUTPUT_FILE = "./public/A3rgYo56weW.csv";
const DEMO_OUTPUT_FILE = "./public/ChSgHo1TwE.csv";

const app = express();
const port = 8010

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

app.use(express.json());
app.disable("x-powered-by");
app.use(express.static("public"));

app.get('/hi', (req, res) => {
    res.send('Hello World!');
})

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
                    if(err){
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

app.listen(port, () => {
    console.log(`Feast server listening locally at http://localhost:${port}`)
});
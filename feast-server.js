/* eslint-env node */

const express = require("express");
const fs = require("fs");

const OUTPUT_FILE = "public/ChSgHo1TwE.csv";
const app = express()
const port = 8000

app.use(express.json());
app.disable("x-powered-by");
app.use(express.static("public"));

app.get('/hi', (req, res) => {
    res.send('Hello World!');
})

app.post("/submit", (req, resp) => {
    const dt = new Date();
    const ip = req.headers["x-forwarded-for"] || req.ip;

    function writeCSV(csv) {
        fs.appendFile(OUTPUT_FILE, csv, () => { });

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
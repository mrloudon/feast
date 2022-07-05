import * as Utility from "./utility.js";
import * as Calibration from "./calibration.js";
import * as FalsePositives from "./falsePositive.js";
import * as Product from "./product.js";

const bodyKeys = {
    keyX: false,
    shiftLeft: false
};

let session = false;
let participantId = false;
let sequence = false;
let falsePositiveData;
let globalsampleData;
let sampleData;

async function loadGlobalSampleData() {
    const sampleStream = await fetch("samples");
    const data = await sampleStream.json();
    console.log("Sample data loaded.");
    return data;
}

async function loadFalsePositiveData() {
    const falsePositiveStream = await fetch(`falsePositives?id=${participantId}`);
    falsePositiveData = await falsePositiveStream.json();
    console.log("Flase positive data loaded.");
}

async function doLandingPage() {
    const page = document.getElementById("landing-page");
    const input = page.querySelector("input");
    const nextBtn = page.querySelector("button.next-btn");
    const tds = page.querySelectorAll("td");
    const idTh = page.querySelector(".table-id");
    const sessionRBs = page.querySelectorAll(".form-check-input[name='session-radio']");
    const sequenceRBs = page.querySelectorAll(".form-check-input[name='sequence-radio']");

    session = false;
    participantId = false;
    sequence = false;

    globalsampleData = await loadGlobalSampleData();
    
    return new Promise(function (resolve) {

        async function nextBtnClick() {
            console.log(participantId);
            await loadFalsePositiveData();
            console.log(falsePositiveData);

            nextBtn.removeEventListener("click", nextBtnClick);
            input.removeEventListener("input", participantInputChange);
            sessionRBs.forEach(rb => rb.removeEventListener("click", sessionRBClick));
            sequenceRBs.forEach(rb => rb.removeEventListener("click", sequenceRBClick));
            Utility.fadeOut(page)
                .then(resolve);
        }

        function participantInputChange() {
            participantId = parseInt(input.value, 10);
            if (typeof participantId === "number" && participantId > 0 && participantId <= 120) {
                idTh.innerHTML = participantId;
                if (session) {
                    sampleData = (session === "1") ? globalsampleData[participantId - 1].samples.slice(5) : globalsampleData[participantId - 1].samples.slice(-5);
                    console.log(sampleData);
                    for (let i = 0; i < tds.length; i++) {
                        if (session === "1") {
                            tds[i].innerHTML = globalsampleData[participantId - 1].samples[i];

                        }
                        else {
                            tds[i].innerHTML = globalsampleData[participantId - 1].samples[5 + i];
                        }
                    }
                }
                nextBtn.disabled = false;
            }
            else {
                participantId = false;
                idTh.innerHTML = "&mdash;";
                tds.forEach(t => t.innerHTML = "&mdash;");
                nextBtn.disabled = true;
            }
            nextBtn.disabled = !(participantId && session && sequence);
        }

        function sessionRBClick(event) {
            console.log(event.target.value);
            session = event.target.value;
            if (typeof participantId === "number" && participantId > 0 && participantId <= 120) {
                sampleData = (session === "1") ? globalsampleData[participantId - 1].samples.slice(0, 5) : globalsampleData[participantId - 1].samples.slice(5);
                console.log(sampleData);
                idTh.innerHTML = participantId;
                if (session) {
                    for (let i = 0; i < tds.length; i++) {
                        if (session === "1") {
                            tds[i].innerHTML = globalsampleData[participantId - 1].samples[i];
                        }
                        else {
                            tds[i].innerHTML = globalsampleData[participantId - 1].samples[5 + i];
                        }
                    }
                }
            }
            nextBtn.disabled = !(participantId && session && sequence);
        }

        function sequenceRBClick(event){
            console.log(event.target.value);
            sequence = event.target.value;
            nextBtn.disabled = !(participantId && session && sequence);
        }

        input.addEventListener("input", participantInputChange);
        nextBtn.addEventListener("click", nextBtnClick);
        sessionRBs.forEach(rb => rb.addEventListener("click", sessionRBClick));
        sequenceRBs.forEach(rb => rb.addEventListener("click", sequenceRBClick));

        nextBtn.disabled = true;

        Utility.fadeIn(page)
            .then(() => input.focus());
    });
}

function doWelcomePage() {
    const page = document.getElementById("welcome-page");
    const nextBtn = page.querySelector("button.next-btn");

    return new Promise(function (resolve) {
        function nextBtnClick() {
            nextBtn.removeEventListener("click", nextBtnClick);
            Utility.fadeOut(page)
                .then(() => {
                    Utility.showJumbos();
                    resolve();
                });
        }

        Utility.hideJumbos();
        nextBtn.addEventListener("click", nextBtnClick);
        Utility.fadeIn(page);
    });
}

function doGoodbyePage() {
    const page = document.getElementById("goodbye-page");
    Utility.hideJumbos();
    Utility.fadeIn(page);
}

function doPracticeCompletedPage() {
    const page = document.getElementById("practice-completed-1-page");
    const nextBtn = page.querySelector(".next-btn");

    return new Promise(function (resolve) {
        function nextBtnClick() {
            nextBtn.removeEventListener("click", nextBtnClick);
            Utility.fadeOut(page)
                .then(resolve);
        }

        nextBtn.addEventListener("click", nextBtnClick);
        Utility.fadeIn(page);
    });
}

async function run() {

    function initialise() {
        document.body.style.overflow = "hidden";
        document.body.addEventListener("keydown", evt => {
            if (evt.code === "KeyX") {
                bodyKeys.keyX = true;
            }
            if (evt.code === "ShiftLeft") {
                bodyKeys.shiftLeft = true;
            }
            if (bodyKeys.keyX && bodyKeys.shiftLeft) {
                window.location.reload();
            }
        });
        document.body.addEventListener("keyup", evt => {
            if (evt.code === "ShiftLeft") {
                bodyKeys.shiftLeft = false;
            }
            if (evt.code === "KeyX") {
                bodyKeys.keyX = false;
            }
        });
    }

    console.log("Running.");
    initialise();

    await doLandingPage();
    await doWelcomePage();
    //await Calibration.doCalibrationTask();
    //await FalsePositives.doFalsePositiveTask(falsePositiveData);
    await doPracticeCompletedPage();
    await Product.doProduct({ sampleCode: sampleData[0], sequence });
    await Product.doProduct({ sampleCode: sampleData[1], sequence });
    doGoodbyePage();

    console.log("Done.");
}

console.log("FEAST V3");
Utility.ready(run);
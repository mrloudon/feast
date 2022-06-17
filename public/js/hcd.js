import * as Utility from "./utility.js";
import * as Calibration from "./calibration.js";
import * as FalsePositives from "./falsePositive.js";
import * as Product from "./product.js";
import { loadCataData } from "./cata.js";

const tasks = [Product.doProduct, doLandingPage, doWelcomePage, doPracticeCompletedPage,
    FalsePositives.doFalsePositiveTask, Calibration.doCalibrationTask];

const bodyKeys = {
    keyX: false,
    shiftLeft: false
};

let session = false;
let participantId = false;

async function doLandingPage() {
    const page = document.getElementById("landing-page");
    const input = page.querySelector("input");
    const nextBtn = page.querySelector("button.next-btn");
    const tds = page.querySelectorAll("td");
    const idTh = page.querySelector(".table-id");
    const rbs = page.querySelectorAll(".form-check-input");

    let cataData;
    session = false;
    participantId = false;

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        input.removeEventListener("input", inputChange);
        rbs.forEach(rb => rb.removeEventListener("click", rbClick));
        Utility.fadeOut(page)
            .then(nextTask);
    }

    function inputChange() {
        participantId = parseInt(input.value, 10);
        if (typeof participantId === "number" && participantId > 0 && participantId <= 120) {
            idTh.innerHTML = participantId;
            for (let i = 0; i < tds.length; i++) {
                tds[i].innerHTML = cataData[participantId - 1].cata[i];
            }
            nextBtn.disabled = false;
        }
        else {
            participantId = false;
            idTh.innerHTML = "&mdash;";
            tds.forEach(t => t.innerHTML = "&mdash;");
            nextBtn.disabled = true;
        }
        nextBtn.disabled = !(participantId && session);
    }

    function rbClick(event) {
        console.log(event.target.value);
        session = event.target.value;
        nextBtn.disabled = !(participantId && session);
    }

    input.addEventListener("input", inputChange);
    nextBtn.addEventListener("click", nextBtnClick);
    rbs.forEach(rb => rb.addEventListener("click", rbClick));

    nextBtn.disabled = true;
    cataData = await loadCataData();

    Utility.fadeIn(page)
        .then(() => input.focus());
}

function doWelcomePage() {
    const page = document.getElementById("welcome-page");
    const nextBtn = page.querySelector("button.next-btn");


    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        Utility.fadeOut(page)
            .then(() => {
                Utility.showJumbos();
                nextTask();
            });
    }

    Utility.hideJumbos();
    nextBtn.addEventListener("click", nextBtnClick);
    Utility.fadeIn(page);
}

function doPracticeCompletedPage() {
    const page = document.getElementById("practice-completed-1-page");
    const nextBtn = page.querySelector(".next-btn");

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        Utility.fadeOut(page)
            .then(nextTask);
    }

    nextBtn.addEventListener("click", nextBtnClick);
    Utility.fadeIn(page);
}

function nextTask(err, result) {
    console.log(`nextTask(${err}, ${result})`);
    if (err) {
        throw err;
    }
    const task = tasks.shift();
    if (task) {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        task(nextTask, result);
    }
}

async function run() {
    console.log("Running.");
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

    nextTask();
}

console.log("FEAST V1");
Utility.ready(run);
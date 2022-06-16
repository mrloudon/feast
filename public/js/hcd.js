import * as Utility from "./utility.js";
import * as Calibration from "./calibration.js";
import * as FalsePositives from "./falsePositive.js";
import * as LikingScale from "./likingScale.js";
import * as Intension from "./intension.js";
import * as Cata from "./cata.js";

const tasks = [doCataTask, Intension.doIntensionTask, doLikingScalePage, doPracticeCompletedPage, FalsePositives.doFalsePositiveTask, Calibration.doCalibrationTask, doWelcomePage];

const bodyKeys = {
    keyX: false,
    shiftLeft: false
};

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

function doLikingScalePage() {

    const page = document.getElementById("liking-scale-page");
    const nextBtn = page.querySelector(".next-btn");

    function callback(value) {
        nextBtn.disabled = false;
        console.log(value);
    }

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        Utility.fadeOut(page)
            .then(nextTask);
    }

    nextBtn.disabled = true;
    nextBtn.addEventListener("click", nextBtnClick);
    LikingScale.doLikingScalePage(page, callback);
    Utility.fadeIn(page);
}

function doCataTask(){
    Cata.doCataTask(1, 235, nextTask);
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
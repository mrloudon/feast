import * as Utility from "./utility.js";
import * as Calibration from "./calibration.js";

const tasks = [Calibration.doCalibrationTask, doPracticeTask2, doPracticeTask2Instructions1Page, doPracticeTask2Instructions2Page, doWelcomePage];

const symbolImages = ["img/dislike-extremely.png", "img/dislike-moderately.png", "img/dislike-slightly.png"];

const bodyKeys = {
    keyX: false,
    shiftLeft: false
};

function doWelcomePage(callback) {
    const page = document.getElementById("welcome-page");
    const nextBtn = page.querySelector("button.next-btn");


    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        Utility.fadeOut(page)
            .then(() => {
                Utility.showJumbos();
                callback();
            });
    }

    Utility.hideJumbos();
    nextBtn.addEventListener("click", nextBtnClick);
    Utility.fadeIn(page);
}

function doPracticeTask2Instructions1Page(callback) {
    const page = document.getElementById("practice-task-2-instructions-1-page");
    const nextBtn = page.querySelector("button.next-btn");

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        Utility.fadeOut(page)
            .then(() => {
                callback();
            });
    }

    nextBtn.addEventListener("click", nextBtnClick);
    Utility.fadeIn(page);
}

function doPracticeTask2Instructions2Page(callback) {
    const page = document.getElementById("practice-task-2-instructions-2-page");

    function keyDown(evt) {
        if (evt.keyCode === 32) {
            document.body.removeEventListener("keydown", keyDown);
            evt.preventDefault();
            evt.stopPropagation();
            Utility.fadeOut(page)
                .then(callback);
            return false;
        }
    }

    Utility.hideJumbos();
    document.body.addEventListener("keydown", keyDown);
    Utility.fadeIn(page);
}

function doPracticeTask2(callback){
    const page = document.getElementById("practice-task-2-stimulus-page");
    const warningDiv = page.querySelector(".warning-div");
    const img = page.querySelector("img");
    const wordDiv = page.querySelector(".word-div");

    const words = ["Red", "Dog", "Rock"];

    const ITI = 1000;
    const N_TRIALS = 3;
    const MAX_RT = 500;
    const WARNING_TIME = 250;

    let acceptKeypresses = false;
    let currentTrial = 0;
    let tooSlowTimer;
    let tooSlow = false;
    let rts = [], startTime;

    function showStimulus() {
        setTimeout(() => {
            console.log(currentTrial);
            if(currentTrial === N_TRIALS){
                console.log(rts);
                console.log(rts.length);
                Utility.fadeOut(page)
                    .then(() => {
                        Utility.showJumbos();
                        callback();
                    });
                return;
            }
            wordDiv.innerHTML = words[currentTrial];
            currentTrial++;
            startTime = Date.now();
            acceptKeypresses = true;
            tooSlow = false;
            tooSlowTimer = setTimeout(() => {
                console.log("too slow");
                wordDiv.innerHTML = "&nbsp;";
                warningDiv.classList.remove("invisible");
                acceptKeypresses = false;
                setTimeout(() => {
                    acceptKeypresses = true;
                }, WARNING_TIME);
                tooSlow = true;
                if(currentTrial > 0){
                    currentTrial--;
                }
            }, MAX_RT);
        }, ITI);

    }

    function keyDown(evt) {
        if (acceptKeypresses && evt.keyCode === 32) {
            acceptKeypresses = false;
            wordDiv.innerHTML = "&nbsp;";
            if(tooSlow){
                warningDiv.classList.add("invisible");
            }
            else{
                rts.push(Date.now() - startTime);
                window.clearTimeout(tooSlowTimer);
            }
            evt.preventDefault();
            evt.stopPropagation();
            showStimulus();
            return false;
        }
    }

    acceptKeypresses = false;
    currentTrial = 0;
    Utility.hideJumbos();
    warningDiv.classList.add("invisible");
    wordDiv.innerHTML = "&nbsp;";
    img.src = symbolImages[0];
    document.body.addEventListener("keydown", keyDown);
    Utility.fadeIn(page)
        .then(showStimulus);
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

function run() {
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
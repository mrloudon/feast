import * as Utility from "./utility.js";

let masterCallback;

const tasks = [doPracticeTask1Instructions1Page, doPracticeTask1Instructions2Page, doReactionTimePage];


function doPracticeTask1Instructions1Page() {
    const page = document.getElementById("practice-task-1-instructions-1-page");
    const nextBtn = page.querySelector("button.next-btn");

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        Utility.fadeOut(page)
            .then(nextTask);
    }

    nextBtn.addEventListener("click", nextBtnClick);
    Utility.fadeIn(page);
}

function doPracticeTask1Instructions2Page() {
    const page = document.getElementById("practice-task-1-instructions-2-page");

    function keyDown(evt) {
        if (evt.keyCode === 32) {
            document.body.removeEventListener("keydown", keyDown);
            evt.preventDefault();
            evt.stopPropagation();
            Utility.fadeOut(page)
                .then(nextTask);
            return false;
        }
    }

    Utility.hideJumbos();
    document.body.addEventListener("keydown", keyDown);
    Utility.fadeIn(page);
}

function doReactionTimePage() {
    const N_TRIALS = 10;
    // const MIN_ITI = 800;
    // const MAX_ITI = 1200
    const ITI = 500;
    const MAX_RT = 3000;

    const page = document.getElementById("reaction-time-page");
    const stimulus = page.querySelector(".stimulus");
    const warningDiv = page.querySelector(".warning-div");
    let acceptKeypresses = false;
    let currentTrial = 0;
    let tooSlowTimer;
    let tooSlow = false;
    let rts = [], startTime;

    function getITI() {
        //return Math.floor(Math.random() * (MAX_ITI - MIN_ITI) + MIN_ITI);
        return ITI;
    }

    function showStimulus() {
        setTimeout(() => {
            console.log(currentTrial);
            if (currentTrial === N_TRIALS) {
                console.log(rts);
                console.log(rts.length);
                document.body.removeEventListener("keydown", keyDown);
                Utility.fadeOut(page)
                    .then(masterCallback);
                return;
            }
            currentTrial++;
            startTime = Date.now();
            stimulus.classList.remove("invisible");
            acceptKeypresses = true;
            tooSlow = false;
            tooSlowTimer = setTimeout(() => {
                console.log("too slow");
                warningDiv.classList.remove("invisible");
                tooSlow = true;
                if (currentTrial > 0) {
                    currentTrial--;
                }
            }, MAX_RT);
        }, getITI());

    }

    function keyDown(evt) {
        if (acceptKeypresses && evt.keyCode === 32) {
            acceptKeypresses = false;
            if (tooSlow) {
                warningDiv.classList.add("invisible");
            }
            else {
                rts.push(Date.now() - startTime);
                window.clearTimeout(tooSlowTimer);
            }
            evt.preventDefault();
            evt.stopPropagation();
            stimulus.classList.add("invisible");
            showStimulus();
            return false;
        }
    }

    stimulus.classList.add("invisible");
    warningDiv.classList.add("invisible");
    document.body.addEventListener("keydown", keyDown);

    Utility.fadeIn(page)
        .then(() => {
            setTimeout(showStimulus, MAX_RT - ITI);
        });
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

function doCalibrationTask(cb) {
    masterCallback = cb;
    nextTask();
}

export { doCalibrationTask };

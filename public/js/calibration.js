import * as Utility from "./utility.js";

function doPracticeTask1Instructions1Page() {
    const page = document.getElementById("practice-task-1-instructions-1-page");
    const nextBtn = page.querySelector("button.next-btn");

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

function doPracticeTask1Instructions2Page() {
    const page = document.getElementById("practice-task-1-instructions-2-page");

    return new Promise(function (resolve) {
        function keyDown(evt) {
            if (evt.keyCode === 32) {
                document.body.removeEventListener("keydown", keyDown);
                evt.preventDefault();
                evt.stopPropagation();
                Utility.fadeOut(page)
                    .then(resolve);
                return false;
            }
        }

        Utility.hideJumbos();
        document.body.addEventListener("keydown", keyDown);
        Utility.fadeIn(page);
    });
}

function doReactionTimePage() {
    const N_TRIALS = 10;
    //const MIN_ITI = 400;
    //const MAX_ITI = 1000;
    const ITI = 1000;
    const MAX_RT = 3000;

    const ITIS = [673, 584, 400, 996, 514, 650, 760, 943, 572, 841, 741, 553, 743, 931,
        627, 480, 668, 461, 956, 426];

    const page = document.getElementById("reaction-time-page");
    const stimulus = page.querySelector(".stimulus");
    const warningDiv = page.querySelector(".warning-div");

    return new Promise(function (resolve) {
        let acceptKeypresses = false;
        let currentTrial = 0;
        let tooSlowTimer;
        let tooSlow = false;
        let csv;
        let rts = [], startTime;

        function getITI() {
            return ITIS[currentTrial];
            //return Math.floor(Math.random() * (MAX_ITI - MIN_ITI) + MIN_ITI);
            //return ITI;
        }

        function showStimulus() {
            setTimeout(() => {
                console.log(currentTrial);
                if (currentTrial === N_TRIALS) {
                    let stats = Utility.meanStdev(rts);
                    let str = "";

                    rts.forEach(rt => str += `${rt};`);
                    str = str.slice(0, -1);
                    csv = `,${str},${Math.round(stats.mean)},${Math.round(stats.stdev)}`;
                    //console.log("Calibration CSV:", csv);
                    document.body.removeEventListener("keydown", keyDown);
                    Utility.fadeOut(page)
                        .then(() => resolve(csv));
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
                setTimeout(showStimulus, ITI);
            });
    });
}

async function doCalibrationTask() {
    let csv;
    await doPracticeTask1Instructions1Page();
    await doPracticeTask1Instructions2Page();
    csv = await doReactionTimePage();
    return csv;
}

export { doCalibrationTask };

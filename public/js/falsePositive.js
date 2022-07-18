import * as Utility from "./utility.js";

const correctNumberWords = ["Four", "Two", "Five", "Nine", "Seven"];
const correctSymbolWords = ["Tree", "Flower", "Ball", "Heart", "Apple"];

let params;

function doPracticeTask2Instructions1Page() {
    const page = document.getElementById("practice-task-2-instructions-1-page");
    const nextBtn = page.querySelector("button.next-btn");

    return new Promise(function (resolve) {
        function nextBtnClick() {
            nextBtn.removeEventListener("click", nextBtnClick);
            Utility.fadeOut(page)
                .then(resolve);
        }

        Utility.showJumbos();
        nextBtn.addEventListener("click", nextBtnClick);
        Utility.fadeIn(page);
    });
}

function doPracticeTask2Instructions2Page() {
    const page = document.getElementById("practice-task-2-instructions-2-page");
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

function doPracticeTask2Instructions3Page() {
    const page = document.getElementById("practice-task-2-instructions-3-page");

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

function doPracticeTask2Instructions4Page() {
    const page = document.getElementById("practice-task-2-instructions-4-page");

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

function doPracticeTask2(p) {
    const page = document.getElementById("practice-task-2-stimulus-page");
    const warningDiv = page.querySelector(".warning-div");
    const img = page.querySelector("img");
    const wordDiv = page.querySelector(".word-div");
    const ITI_1 = 3000;
    const ITI_2 = 500;
    const N_TRIALS = 5;

    return new Promise(function (resolve) {

        let currentTrial = 0;
        let missed = false;
        let acceptKeyPresses = false;
        let threeSecondTimer;
        let currentWord;
        let hits = 0;
        let correctRejections = 0;
        let misses = 0;
        let falseAlarms = 0;

        params = p;

        function endTask() {
            console.log("Trials completed");
            document.removeEventListener("keydown", keyDown);
            Utility.fadeOut(page)
                .then(() => resolve(`,${hits},${misses},${correctRejections},${falseAlarms}`));
        }

        function keyDown(evt) {
            if (acceptKeyPresses && evt.keyCode === 32) {
                acceptKeyPresses = false;
                if (missed) {
                    console.log("Next trial after miss");
                    missed = false;
                    warningDiv.classList.add("invisible");
                    showStimulus();
                }
                else {
                    window.clearTimeout(threeSecondTimer);
                    if (params.correct.includes(currentWord)) {
                        hits++;
                        console.log("Hit");
                        wordDiv.innerHTML = "&nbsp;";
                    }
                    else {
                        falseAlarms++;
                        console.log("False alarm");
                    }
                    if (currentTrial === N_TRIALS) {
                        endTask();
                    }
                    else {
                        setTimeout(() => {
                            showStimulus();
                        }, ITI_2);
                    }
                }
                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        }

        function showStimulus() {
            currentWord = params.words[currentTrial++]
            console.log(`Trial: ${currentTrial}`);
            wordDiv.innerHTML = currentWord;
            acceptKeyPresses = true;

            threeSecondTimer = setTimeout(() => {
                if (currentTrial === N_TRIALS) {
                    endTask();
                    return;
                }
                if (params.correct.includes(currentWord)) {
                    misses++;
                    console.log("Miss");
                    missed = true;
                    warningDiv.classList.remove("invisible");
                }
                else {
                    correctRejections++;
                    console.log("Correct rejection");
                    showStimulus();
                }
            }, ITI_1);
        }

        warningDiv.classList.add("invisible");
        img.src = params.image;

        document.addEventListener("keydown", keyDown);
        Utility.fadeIn(page)
            .then(showStimulus);
    });
}

function doFalsePositiveTaskPart1(p) {

    return Promise.resolve(doPracticeTask2Instructions1Page()
        .then(doPracticeTask2Instructions2Page)
        .then(doPracticeTask2Instructions3Page)
        .then(() => doPracticeTask2(p)));

}

async function doFalsePositiveTask(falsePositiveData) {
    let csv;

    csv = await doFalsePositiveTaskPart1({
        words: falsePositiveData[0].words,
        correct: correctNumberWords,
        image: "img/numbers.png"
    });
    await doPracticeTask2Instructions4Page();
    csv += await doPracticeTask2({
        words: falsePositiveData[1].words,
        correct: correctSymbolWords,
        image: "img/symbols2.png"
    });
    
    return csv;
}

export { doFalsePositiveTask };
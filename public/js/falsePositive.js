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

/* function doPracticeTask2(p) {
    const page = document.getElementById("practice-task-2-stimulus-page");
    const warningDiv = page.querySelector(".warning-div");
    const warningMessage = page.querySelector(".warning-message");
    const img = page.querySelector("img");
    const wordDiv = page.querySelector(".word-div");
    const ITI_1 = 3000;
    const ITI_2 = 500;
    const N_TRIALS = 3;

    return new Promise(function (resolve) {

        let currentTrial = 0;
        let previousResponseIncorrect = false;
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
                if (previousResponseIncorrect) {
                    console.log("Next trial after miss/false alarm");
                    previousResponseIncorrect = false;
                    warningDiv.classList.add("invisible");
                    warningMessage.innerHTML = "&nbsp;";
                    if (currentTrial === N_TRIALS) {
                        endTask();
                    } else {
                        showStimulus();
                    }
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
                        warningMessage.innerHTML = "The word <strong>did not</strong> match the picture.";
                        warningDiv.classList.remove("invisible");
                        previousResponseIncorrect = true;
                        setTimeout(() => acceptKeyPresses = true, 200);
                        evt.preventDefault();
                        evt.stopPropagation();
                        return false;
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
            if(currentTrial > N_TRIALS){
                throw "Bad trial. currentTrial > N_TRIALS";
            }
            currentWord = params.words[currentTrial++]
            console.log(`Trial: ${currentTrial}`);
            wordDiv.innerHTML = currentWord;
            acceptKeyPresses = true;

            threeSecondTimer = setTimeout(() => {

                if (params.correct.includes(currentWord)) {
                    misses++;
                    console.log("Miss");
                    // if all trials completed don't bother with the miss error message.
                    if (currentTrial === N_TRIALS) {
                        endTask();
                    }
                    else {
                        // Show miss error
                        warningMessage.innerHTML = "Please answer as quickly as possible. The word matched the picture.";
                        warningDiv.classList.remove("invisible");
                        // Dont show the next stimulus, just wait for a space bar, so return.
                        previousResponseIncorrect = true;
                    }
                }
                else {
                    correctRejections++;
                    console.log("Correct rejection");
                    if (currentTrial === N_TRIALS) {
                        endTask();
                    }
                    else {
                        showStimulus();
                    }
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
*/


function doPracticeTask2(p) {
    const page = document.getElementById("practice-task-2-stimulus-page");
    const warningDiv = page.querySelector(".warning-div");
    const warningMessage = page.querySelector(".warning-message");
    const img = page.querySelector("img");
    const wordDiv = page.querySelector(".word-div");
    const ITI_1 = 3000;
    const ITI_2 = 500;
    const N_TRIALS = 8;

    return new Promise(function (resolve) {

        let currentTrial = -1;
        let waitingForSpacebar = false;
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

        async function keyDown(evt) {
            if (acceptKeyPresses && evt.keyCode === 32) {
                acceptKeyPresses = false;
                if (waitingForSpacebar) {
                    console.log("Previous trial miss or false alarm");
                    // Should not be last trial
                    if(currentTrial === (N_TRIALS - 1)){
                        throw "Illegal state: waitingForSpacebar on last trial";
                    }
                    waitingForSpacebar = false;
                    wordDiv.innerHTML = "&nbsp;";
                    warningDiv.classList.add("invisible");
                    warningMessage.innerHTML = "&nbsp;";
                    await Utility.wait(ITI_2);
                    showStimulus();
                }
                else {
                    // Clear the timer regardless of hit or flase alarm
                    window.clearTimeout(threeSecondTimer);
                   
                    // HIT
                    if (params.correct.includes(currentWord)) {
                        hits++;
                        // Clear the stimulus if hit, otherwise leave it up for error
                        wordDiv.innerHTML = "&nbsp;";
                        console.log("Hit");
                        await Utility.wait(ITI_2);
                        if (currentTrial === (N_TRIALS - 1)) {
                            endTask();
                        }
                        else{
                            showStimulus();
                        }
                    }

                    // FALSE ALARM
                    else {
                        falseAlarms++;
                        console.log("False alarm");

                        if (currentTrial === (N_TRIALS - 1)) {
                            await Utility.wait(ITI_2);
                            endTask();
                        }
                        else {
                            warningMessage.innerHTML = "The word <strong>did not</strong> match the picture.";
                            warningDiv.classList.remove("invisible");
                            waitingForSpacebar = true;
                            setTimeout(() => acceptKeyPresses = true, 200);
                        }   
                    }
                }

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        }

        function showStimulus() {
            if(currentTrial > (N_TRIALS - 1)){
                throw "Bad trial. currentTrial > N_TRIALS - 1 showStimulus()";
            }
            currentTrial++;
            currentWord = params.words[currentTrial]
            console.log(`Trial: ${currentTrial} End: ${N_TRIALS - 1} Equal: ${currentTrial === (N_TRIALS - 1)}`);
            wordDiv.innerHTML = currentWord;
            waitingForSpacebar = false;
            acceptKeyPresses = true;
            
            threeSecondTimer = setTimeout(async () => {

                // MISS
                if (params.correct.includes(currentWord)) {
                    misses++;
                    console.log("Miss");
                    // if all trials completed don't bother with the miss error message.
                    if (currentTrial === (N_TRIALS - 1)) {
                        await Utility.wait(ITI_2);
                        endTask();
                    }
                    else {
                        // Show miss error
                        warningMessage.innerHTML = "Please answer as quickly as possible. The word matched the picture.";
                        warningDiv.classList.remove("invisible");
                        // Dont show the next stimulus, just wait for a space bar, so return.
                        waitingForSpacebar = true;
                    }
                }

                // CORRECT REJECTION
                else {
                    correctRejections++;
                    console.log("Correct rejection");
                    // Hide the stimulus immediately on correct rejection
                    wordDiv.innerHTML = "&nbsp;";
                    if (currentTrial === (N_TRIALS - 1)) {
                        // No need to wait ITI_2 as they havent responded
                        endTask();
                    }
                    else {
                        wordDiv.innerHTML = "&nbsp;";
                        await Utility.wait(ITI_2);
                        showStimulus();
                    }
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
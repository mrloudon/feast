import * as Utility from "./utility.js";

/* const emotionWords = [
    "Adventurous",
    "Bored",
    "Cheap",
    "Classy",
    "Comforted",
    "Energised",
    "Feminine",
    "Genuine",
    "Happy",
    "Inspired",
    "Irritated",
    "Masculine",
    "Modern",
    "Pretentious",
    "Relaxed",
    "Sensual",
    "Simple",
    "Sophisticated",
    "Traditional",
    "Uninspired"
]; */

const emotionWords = Utility.emotionWords;

function doIntensionInstructions1Page() {
    return new Promise(function (resolve) {
        const page = document.getElementById("intension-instructions-1-page");
        const nextBtn = page.querySelector(".next-btn");

        function nextBtnClick() {
            nextBtn.removeEventListener("click", nextBtnClick);
            Utility.fadeOut(page)
                .then(() => {
                    Utility.showJumbos();
                    resolve();
                });
        }

        nextBtn.addEventListener("click", nextBtnClick);
        Utility.hideJumbos();
        Utility.fadeIn(page);
        console.log("Intension instructions 1");
    });
}

function doIntensionInstructions2Page() {
    return new Promise(function (resolve) {
        const page = document.getElementById("intension-instructions-2-page");
        const nextBtn = page.querySelector(".next-btn");

        function nextBtnClick() {
            nextBtn.removeEventListener("click", nextBtnClick);
            Utility.fadeOut(page)
                .then(resolve);
        }

        nextBtn.addEventListener("click", nextBtnClick);
        Utility.fadeIn(page);
        console.log("Intension instructions 2");
    });
}

function doIntensionInstructions3Page({ sampleCode }) {
    return new Promise(function (resolve) {
        const page = document.getElementById("intension-instructions-3-page");
        const sampleCodes = page.querySelectorAll(".sample-code");

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

        sampleCodes.forEach(span => span.innerHTML = sampleCode);
        document.body.addEventListener("keydown", keyDown);
        Utility.fadeIn(page);
        console.log("Intension instructions 3");
    });
}

function doIntensionTaskPage({ intensionData }) {
    return new Promise(function (resolve) {
        const onTime = 1000;
        const offTime = 500;
        const page = document.getElementById("intension-stimulus-page");
        const intensionWord = page.querySelector(".intension-word");

        let currentTrial = -1;
        let acceptKeypresses = false;
        let onTimer = false;
        let word;
        let responses = [];
        let startTime;

        function keyDown(evt) {
            if (acceptKeypresses && evt.keyCode === 32) {
                evt.preventDefault();
                evt.stopPropagation();
                clearTimeout(onTimer);
                responses.push({
                    word,
                    rt: (Date.now() - startTime)
                });
                nextTrial();
                return false;
            }
        }

        async function nextTrial() {
            let wordIndex;

            intensionWord.classList.add("invisible");
            acceptKeypresses = false;
            currentTrial++
            if (currentTrial === intensionData.length) {
                document.body.removeEventListener("keydown", keyDown);
                Utility.fadeOut(page)
                    .then(() => resolve(responses));
                return;
            }
            wordIndex = parseInt(intensionData[currentTrial], 10) - 1;
            word = emotionWords[wordIndex];
            console.log(wordIndex, word);
            intensionWord.innerHTML = word;
            await Utility.wait(offTime);
            intensionWord.classList.remove("invisible");
            startTime = Date.now();
            acceptKeypresses = true;
            onTimer = setTimeout(() => {
                intensionWord.classList.add("invisible");
                responses.push({
                    word,
                    rt: 0
                });
                nextTrial();
            }, onTime);
        }

        document.body.addEventListener("keydown", keyDown);
        intensionWord.classList.add("invisible");
        Utility.hideJumbos();
        Utility.fadeIn(page).then(nextTrial);
        console.log("Intension task.");
    });
}

async function doIntensionTask({ sampleCode, intensionData }) {
    let csv, responses;
    await doIntensionInstructions1Page();
    await doIntensionInstructions2Page();
    await doIntensionInstructions3Page({ sampleCode });
    responses = await doIntensionTaskPage({ intensionData });
    Utility.sortByKey(responses, "word");
    csv = "";
    for(let resp of responses){
        csv += `${resp.rt} ${resp.word},`;
    }
    csv = csv.slice(0,-1);
    Utility.showJumbos();
    console.log(csv);
    return csv;
}

export { doIntensionTask };

import * as Utility from "./utility.js";
import * as LikingScale from "./likingScale.js";
import * as Intension from "./intension.js";
import * as Cata from "./cata.js";



function doCountdownPage() {
    const INTERVAL = 60;
    const page = document.getElementById("countdown-page");
    const countdownSpan = page.querySelector(".countdown");
    let countDown = INTERVAL;

    /* function getCountDownString() {
        let mins = (Math.floor(countDown / 60)).toString();
        let secs = (countDown % 60).toString();
        if (secs.length < 2) {
            secs = `0${secs}`;
        }
        return `${mins}:${secs}`;
    }
 */
    return new Promise(function (resolve) {
        countdownSpan.innerHTML = countDown;
        Utility.fadeIn(page)
            .then(() => {
                let timer = setInterval(() => {
                    countDown--;
                    if (countDown === 0) {
                        window.clearInterval(timer);
                        Utility.fadeOut(page)
                            .then(resolve);
                    }
                    countdownSpan.innerHTML = countDown;
                }, 1000);
            });
    });
}

function doLikingScalePage({ sampleCode }) {

    return new Promise(function (resolve) {
        const page = document.getElementById("liking-scale-page");
        const nextBtn = page.querySelector(".next-btn");
        const sampleCodeSpan = page.querySelector(".code-span");

        let selection;

        function callback(value) {
            nextBtn.disabled = false;
            selection = value;
        }

        function nextBtnClick() {
            nextBtn.removeEventListener("click", nextBtnClick);
            LikingScale.removeEventListeners();
            Utility.fadeOut(page)
                .then(() => {
                    resolve(selection);
                });
        }

        sampleCodeSpan.innerHTML = sampleCode;
        nextBtn.disabled = true;
        nextBtn.addEventListener("click", nextBtnClick);
        LikingScale.doLikingScalePage(page, callback);
        Utility.fadeIn(page);
    });
}

async function doProduct({ sampleCode, sequence, emotionCataData, sensoryCataData, intensionData }) {
    let csv, intensionCsv, emotionCataCsv, sensoryCataCsv;
    if (sequence !== "1" && sequence !== "2") {
        throw "Invalid CATA/Intension sequence.";
    }
    const choice = await doLikingScalePage({ sampleCode });
    console.log(choice);


    if (sequence === "1") {
        intensionCsv = await Intension.doIntensionTask({ sampleCode, intensionData });
        emotionCataCsv = await Cata.doCataTask({ sampleCode, headerIndex: 0, cataData: emotionCataData });
    }
    else {
        emotionCataCsv = await Cata.doCataTask({ sampleCode, headerIndex: 0, cataData: emotionCataData });
        intensionCsv = await Intension.doIntensionTask({ sampleCode, intensionData });
    }

    sensoryCataCsv = await Cata.doCataTask({ sampleCode, headerIndex: 1, cataData: sensoryCataData });

    csv = `,${sampleCode},${choice},${intensionCsv},${emotionCataCsv},${sensoryCataCsv}`;
    return csv;
}

export { doProduct, doCountdownPage };
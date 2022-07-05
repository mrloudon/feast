import * as Utility from "./utility.js";
import * as LikingScale from "./likingScale.js";
import * as Intension from "./intension.js";
import * as Cata from "./cata.js";

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

async function doProduct({ sampleCode, sequence, emotionCataData, sensoryCataData }) {
    if(sequence !== "1" && sequence !== "2"){
        throw "Invalid CATA/Intension sequence.";
    }
    const choice = await doLikingScalePage({ sampleCode });
    console.log(choice);

    if(sequence === "1"){
        await Intension.doIntensionTask({ sampleCode });
        await Cata.doCataTask({ sampleCode, headerIndex: 0, cataData: emotionCataData });
    }
    else {
        await Cata.doCataTask({ sampleCode, headerIndex: 0, cataData: emotionCataData });
        await Intension.doIntensionTask({ sampleCode });
    }
    
    await Cata.doCataTask({ sampleCode, headerIndex: 1, cataData: sensoryCataData });
}

export { doProduct };
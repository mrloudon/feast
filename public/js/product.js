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

async function doProduct({ sampleCode }) {
    const choice = await doLikingScalePage({ sampleCode });
    console.log(choice);
    await Cata.loadCataData();
    await Intension.doIntensionTask({ sampleCode });
    await Cata.doCataTask({ sampleCode, index: 0 });
    await Cata.doCataTask({ sampleCode, index: 1 });
}

export { doProduct };
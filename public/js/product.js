import * as Utility from "./utility.js";
import * as LikingScale from "./likingScale.js";
import * as Intension from "./intension.js";
import * as Cata from "./cata.js";

function doLikingScalePage() {

    return new Promise(function(resolve){
        const page = document.getElementById("liking-scale-page");
        const nextBtn = page.querySelector(".next-btn");
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
    
        nextBtn.disabled = true;
        nextBtn.addEventListener("click", nextBtnClick);
        LikingScale.doLikingScalePage(page, callback);
        Utility.fadeIn(page);
    });
}

async function doProduct(){
    const choice = await doLikingScalePage();
    console.log(choice);
    await Cata.loadCataData();
    await Intension.doIntensionTask();
    await Cata.doCataTask(0, 123);
    await Cata.doCataTask(1, 123);
}

export { doProduct };
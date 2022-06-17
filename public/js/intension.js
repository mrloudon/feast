import * as Utility from "./utility.js";

function doIntensionInstructions1Page() {
    return new Promise(function(resolve){
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
    return new Promise(function(resolve){
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

async function doIntensionTask() {
    await doIntensionInstructions1Page();
    await doIntensionInstructions2Page();
}

export { doIntensionTask };

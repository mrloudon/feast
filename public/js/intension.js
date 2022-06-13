import * as Utility from "./utility.js";

const tasks = [doIntensionInstructions1Page, doIntensionInstructions2Page];

function doIntensionInstructions1Page() {
    const page = document.getElementById("intension-instructions-1-page");
    const nextBtn = page.querySelector(".next-btn");

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        Utility.fadeOut(page)
            .then(() => {
                Utility.showJumbos();
                nextTask();
            });
    }

    nextBtn.addEventListener("click", nextBtnClick);
    Utility.hideJumbos();
    Utility.fadeIn(page);
    console.log("Intension instructions 1");
}

function doIntensionInstructions2Page() {
    const page = document.getElementById("intension-instructions-2-page");
    const nextBtn = page.querySelector(".next-btn");

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        Utility.fadeOut(page)
            .then(nextTask);
    }

    nextBtn.addEventListener("click", nextBtnClick);
    Utility.fadeIn(page);
    console.log("Intension instructions 2");
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

function doIntensionTask() {
    nextTask();
}

export { doIntensionTask };

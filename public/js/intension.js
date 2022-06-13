import * as Utility from "./utility.js";

const tasks = [doIntensionInstructions1Page];

function doIntensionInstructions1Page() {
    const page = document.getElementById("intension-instructions-1-page");

    Utility.hideJumbos();
    Utility.fadeIn(page);
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

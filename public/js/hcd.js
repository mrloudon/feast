import * as Utility from "./utility.js";

const tasks = [doWelcomePage, doPracticeInstructions1Page, doPracticeInstructions2Page];

const bodyKeys = {
    keyX: false,
    shiftLeft: false
};

function hideJumbos(){
    document.querySelectorAll(".jumbotron").forEach(jumbo => jumbo.style.display = "none");
}

function showJumbos(){
    document.querySelectorAll(".jumbotron").forEach(jumbo => jumbo.style.display = "block");
}

function doWelcomePage(callback) {
    const page = document.getElementById("welcome-page");
    const nextBtn = page.querySelector("button.next-btn");
    

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        Utility.fadeOut(page)
            .then(() => {
                showJumbos();
                callback();
            });
    }

    hideJumbos();
    nextBtn.addEventListener("click", nextBtnClick);
    Utility.fadeIn(page);
}

function doPracticeInstructions1Page(callback) {
    const page = document.getElementById("practice-instructions-1-page");
    const nextBtn = page.querySelector("button.next-btn");

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        Utility.fadeOut(page)
            .then(() => {
                callback();
            });
    }

    nextBtn.addEventListener("click", nextBtnClick);
    Utility.fadeIn(page);
}

function doPracticeInstructions2Page(callback) {
    const page = document.getElementById("practice-instructions-2-page");
   
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

function run() {
    console.log("Running.");
    document.body.style.overflow = "hidden";
    document.body.addEventListener("keydown", evt => {
        if (evt.code === "KeyX") {
            bodyKeys.keyX = true;
        }
        if (evt.code === "ShiftLeft") {
            bodyKeys.shiftLeft = true;
        }
        if (bodyKeys.keyX && bodyKeys.shiftLeft) {
            window.location.reload();
        }
    });
    document.body.addEventListener("keyup", evt => {
        if (evt.code === "ShiftLeft") {
            bodyKeys.shiftLeft = false;
        }
        if (evt.code === "KeyX") {
            bodyKeys.keyX = false;
        }
    });
    nextTask();
}

console.log("FEAST V1");
Utility.ready(run);
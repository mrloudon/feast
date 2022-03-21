/* global fabric */

import * as Utility from "./utility.js";

const tasks = [doInstructions1Page, doScalePage, doWelcomePage, doIntroPage, doWordsPage, doInterBlockPage, doGoodbyePage];

const words = ["Happy", "Sad", "Disgust", "Anger", "Fear", "Love", "Hate"];
const params = {
    mode: "",
    order: "",
    emojiCSV: "",
    wordsCSV: ""
};

function doWordsPage(callback) {
    const ITI = 500;
    const ON_TIME = 3000;
    const page = document.getElementById("words-page");
    const wordSpan = page.querySelector("h1");
    let currentWord = 0;
    let startTime = 0;
    let timer;
    let validKeys;
    let jumbotrons;
    let ignoreKeypresses = true;

    function endTrial(timedOut, responseTime, response) {
        console.log(responseTime, "ms");
        params.wordsCSV += `,"${wordSpan.innerText.toLowerCase()}","${timedOut}",${Math.round(responseTime)},"${response}"`;
        if (timer) {
            window.clearTimeout(timer);
            timer = null;
        }
        if (currentWord < words.length) {
            doTrial();
        }
        else {
            document.body.removeEventListener("keydown", keyDown);
            Utility.fadeOut(page)
                .then(() => {
                    jumbotrons.forEach(element => element.style.visibility = "visible");
                    document.body.style.cursor = "default";
                    callback();
                });
        }
    }

    function keyDown(evt) {
        console.log("Word page keypress", evt.keyCode);
        if (ignoreKeypresses) {
            return;
        }
        if (validKeys[evt.keyCode]) {
            endTrial("F", Date.now() - startTime, validKeys[evt.keyCode]);
            evt.preventDefault();
            evt.stopPropagation();
            return false;
        }
    }

    async function doTrial() {
        ignoreKeypresses = true;
        wordSpan.style.visibility = "hidden";
        wordSpan.innerHTML = words[currentWord++];
        await Utility.wait(ITI);
        window.requestAnimationFrame(() => {
            wordSpan.style.visibility = "visible";
            ignoreKeypresses = false;
            startTime = Date.now();
            timer = window.setTimeout(() => {
                timer = null;
                endTrial("T", 0, "None");
            }, ON_TIME);
        });
    }

    jumbotrons = document.querySelectorAll(".jumbotron");
    jumbotrons.forEach(element => element.style.visibility = "hidden");
    document.body.addEventListener("keydown", keyDown);
    wordSpan.style.visibility = "hidden";
    document.body.style.cursor = "none";

    switch (params.mode) {
        case "mode-1": validKeys = {
            "90": "Y",
            "191": "N"
        };
            break;
        case "mode-2": validKeys = { "32": "Y" };
            break;
    }

    Utility.fadeIn(page)
        .then(doTrial);
}

function doIntroPage(callback) {
    const page = document.getElementById("landing-page");
    const input = page.querySelector("input");
    const nextBtn = page.querySelector("button.next-btn");

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        console.log(params);
        Utility.fadeOut(page)
            .then(callback);
    }

    function inputChange() {
        const id = parseInt(input.value, 10);
        if (typeof id === "number" && id > 0 && id < 1000) {
            nextBtn.disabled = false;
        }
        else {
            nextBtn.disabled = true;
        }
    }

    input.addEventListener("input", inputChange);
    nextBtn.addEventListener("click", nextBtnClick);
    nextBtn.disabled = true;

    Utility.fadeIn(page)
        .then(() => input.focus());
}

function doWelcomePage(callback) {
    const page = document.getElementById("welcome-page");
    const nextBtn = page.querySelector("button.next-btn");
    const jumbos = document.querySelectorAll(".jumbotron");

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        console.log(params);
        Utility.fadeOut(page)
            .then(() => {
                jumbos.forEach(jumbo => jumbo.style.display = "block");
                callback();
            });
    }

    jumbos.forEach(jumbo => jumbo.style.display = "none");
    nextBtn.addEventListener("click", nextBtnClick);
    Utility.fadeIn(page);
}

function doScalePage(callback) {
    const page = document.getElementById("scale-page");
    const nextBtn = page.querySelector("button.next-btn");
    const jumbos = document.querySelectorAll(".jumbotron");

    function doCanvasScale() {

        const textNames = [
            "Dislike\nextremely",
            "Dislike\nvery much",
            "Dislike\nmoderately",
            "Dislike\nslightly",
            "Neither like\nnor dislike",
            "Like\nslightly",
            "Like\nmoderately",
            "Like\nvery much",
            "Like\nextremely"
        ];
        const canvas = new fabric.Canvas("c");

        const rect = new fabric.Rect({
            left: 20,
            top: 180,
            fill: "#666",
            width: 965,
            height: 5,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            hasControls: false,
            hasBorders: false
        });

        const pointer = new fabric.Triangle({
            width: 40,
            height: 30,
            fill: "#ffca2c",
            left: 50,
            top: 150,
            angle: 180,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            hasControls: false,
            hasBorders: false,
            visible: false
        });

        function buildTexts() {
            let textX = 50;
            let pointerX = 42;
            let value = 0;

            textNames.forEach(caption => {
                const text = new fabric.Text(caption, {
                    left: textX,
                    top: 10,
                    fontSize: 20,
                    fontFamily: "Arial",
                    angle: 90,
                    lockMovementX: true,
                    lockMovementY: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockRotation: true,
                    hasControls: false,
                    hasBorders: false,
                    value,
                    kind: "label",
                    pointerX: pointerX
                });
                canvas.add(text);

                const tick = new fabric.Rect({
                    left: pointerX - 28,
                    top: 150,
                    fill: "#666",
                    width: 15,
                    height: 35,
                    lockMovementX: true,
                    lockMovementY: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockRotation: true,
                    hasControls: false,
                    hasBorders: false,
                    kind: "label",
                    pointerX: pointerX
                });
                canvas.add(tick);

                textX += 120;
                pointerX += 120;
                value++;
            });
        }

       /*  const rect = new fabric.Rect({
            left: 20,
            top: 180,
            fill: "#666",
            width: 965,
            height: 5,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            hasControls: false,
            hasBorders: false
        });

        const pointer = new fabric.Triangle({
            width: 40,
            height: 60,
            fill: "#ffca2c",
            left: 50,
            top: 180,
            angle: 180,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            hasControls: false,
            hasBorders: false,
            visible: false
        }); */

        canvas.on("mouse:down", function (options) {
            if (options.target && options.target.kind && options.target.kind === "label") {
                console.log("Click");
                pointer.left = options.target.pointerX;
                pointer.visible = true;
                nextBtn.disabled = false;
            }
        });

        canvas.hoverCursor = "pointer";
        canvas.add(rect);
        canvas.add(pointer);
        buildTexts();
    }

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        console.log(params);
        Utility.fadeOut(page)
            .then(() => {
                jumbos.forEach(jumbo => jumbo.style.display = "block");
                callback();
            });
    }

    jumbos.forEach(jumbo => jumbo.style.display = "none");
    nextBtn.addEventListener("click", nextBtnClick);
    nextBtn.disabled = true;
    doCanvasScale();
    Utility.fadeIn(page);
}

function doInstructions1Page(callback) {
    const page = document.getElementById("instructions-1-page");
    const nextBtn = page.querySelector("button.next-btn");
    const jumbos = document.querySelectorAll(".jumbotron");

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        console.log(params);
        Utility.fadeOut(page)
            .then(() => {
                jumbos.forEach(jumbo => jumbo.style.display = "block");
                callback();
            });
    }

    //jumbos.forEach(jumbo => jumbo.style.display = "none");
    nextBtn.addEventListener("click", nextBtnClick);
    Utility.fadeIn(page);
}

function doInterBlockPage(callback) {
    console.log("Do inter-block page");
    const page = document.getElementById("inter-block-page");
    const nextBtn = page.querySelector("button.next-btn");

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        Utility.fadeOut(page)
            .then(callback);
    }

    nextBtn.addEventListener("click", nextBtnClick);
    document.querySelectorAll(".jumbotron").forEach(element => element.style.visibility = "visible");
    Utility.fadeIn(page);
}

function doGoodbyePage() {
    console.log("Do goodbye page");
    const csv = `"${params.mode}","${params.order}"${params.wordsCSV}${params.emojiCSV}`;
    Utility.postCSV(csv);
    const page = document.getElementById("goodbye-page");
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
    nextTask();
}

console.log("FEAST V1");
Utility.ready(run);
/* global fabric */

import * as Utility from "./utility.js";

const participants = [
    { id: "1", codes: ["356", "102", "947", "825", "491", "270", "728", "599", "647"] },
    /* { id: "2", codes: ["825", "491", "270", "356", "102", "947"] },
    { id: "3", codes: ["356", "102", "947", "825", "491", "270"] },
    { id: "4", codes: ["825", "491", "270", "356", "102", "947"] },
    { id: "5", codes: ["356", "102", "947", "825", "491", "270"] },
    { id: "6", codes: ["825", "491", "270", "356", "102", "947"] },
    { id: "7", codes: ["356", "102", "947", "825", "491", "270"] },
    { id: "8", codes: ["825", "491", "270", "356", "102", "947"] },
    { id: "9", codes: ["356", "102", "947", "825", "491", "270"] },
    { id: "10", codes: ["825", "491", "270", "356", "102", "947"] } */
];

const tasks = [
    doIntroPage, doWelcomePage,
    doButtonScalePage,
    doInstructions1Page, doInstructions2Page, doWordsPage, doInterBlockPage,
    doInstructions1Page, doInstructions2Page, doWordsPage, doInterBlockPage,
    prepareDelay2Min, doCountdownPage,
    doButtonScalePage,
    doInstructions1Page, doInstructions2Page, doWordsPage, doInterBlockPage,
    doInstructions1Page, doInstructions2Page, doWordsPage,
    prepareDelay2Min, doCountdownPage,
    doButtonScalePage,
    doInstructions1Page, doInstructions2Page, doWordsPage, doInterBlockPage,
    doInstructions1Page, doInstructions2Page, doWordsPage,
    doGoodbyePage];

//const words = ["Satisfied", "Comforted", "Happy", "Indulgent", "Pleasant", "Nostalgic", "Bored", "Disappointed", "Disgusted", "Relaxed", "Uncomfortable", "Delight"];
const words = ["Satisfied", "Comforted", "Happy", "Indulgent", "Pleasant"];

const params = {
    mode: "mode-2",
    masterCSV: "",
    /* scale1CSV: "",
    words1CSV: "",
    scale2CSV: "",
    words2CSV: "", */
    participant: null,
    state: 0
};

const bodyKeys = {
    keyX: false,
    shiftLeft: false
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
    let responses = [];

    function endTrial(timedOut, responseTime, response) {
        console.log(responseTime, "ms");
        responses.push({
            word: wordSpan.innerText.toLowerCase(),
            timedOut,
            responseTime,
            response
        });
        //params.wordsCSV += `,"${wordSpan.innerText.toLowerCase()}","${timedOut}",${Math.round(responseTime)},"${response}"`;
        if (timer) {
            window.clearTimeout(timer);
            timer = null;
        }
        if (currentWord < words.length) {
            doTrial();
        }
        else {
            responses.sort((a, b) => (a.word > b.word ? 1 : -1));
            responses.forEach(response => params.masterCSV += `,"${response.timedOut}",${Math.round(response.responseTime)},"${response.response}"`);
            console.log(params.masterCSV);
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
    const tds = page.querySelectorAll("td");
    const idTh = page.querySelector(".id-th");

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        params.masterCSV += `"${params.participant.id}","${words.toString()}"`;
        console.log(params.masterCSV);
        Utility.fadeOut(page)
            .then(callback);
    }

    function inputChange() {
        const id = parseInt(input.value, 10);
        if (typeof id === "number" && id > 0 && id < 2) {
            idTh.innerHTML = id;
            params.participant = participants.find(p => p.id === id.toString());
            for (let i = 0; i < tds.length; i++) {
                tds[i].innerHTML = params.participant.codes[i];
            }
            nextBtn.disabled = false;
        }
        else {
            idTh.innerHTML = "&mdash;";
            tds.forEach(t => t.innerHTML = "&mdash;");
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

function doButtonScalePage(callback) {
    const page = document.getElementById("scale-page");
    const nextBtn = page.querySelector("button.next-btn");
    const jumbos = document.querySelectorAll(".jumbotron");
    const span = page.querySelector(".code-span");
    let startTime, clickTime, stopTime, selection;

    const buttonScale = {

        textItemClick: function (evt) {
            clickTime = Date.now();
            let item = evt.currentTarget;
            selection = item.dataset.id;
            buttonScale.textScaleItems.forEach(item => {
                item.classList.remove("btn-warning");
                item.classList.add("btn-primary");
            });
            item.classList.remove("btn-primary");
            item.classList.add("btn-warning");
            nextBtn.disabled = false;
        },

        create: function () {
            const textScaleDiv1 = page.querySelector(".text-scale-div-1");
            const textNamesHTML = [
                "Dislike<br>extremely",
                "Dislike<br>very much",
                "Dislike<br>moderately",
                "Dislike<br>slightly",
                "Neither like<br>nor dislike",
                "Like<br>slightly",
                "Like<br>moderately",
                "Like<br>very much",
                "Like<br>extremely"
            ];
            let textScaleHTML = "";
            let i = 0;

            textNamesHTML.forEach(captionHTML => {
                const btnHTML = `<button type="button" class="col btn btn-primary text-scale-item" data-id="${i}">${captionHTML}</button>`;
                textScaleHTML += btnHTML;
                i++;
            });
            textScaleDiv1.innerHTML = textScaleHTML;
            this.textScaleItems = page.querySelectorAll(".text-scale-div-1 .text-scale-item");
            this.textScaleItems.forEach(item => item.addEventListener("click", this.textItemClick));
        },

        destroy: function () {
            this.textScaleItems.forEach(item => item.removeEventListener("click", this.textItemClick));
        }
    };

    function nextBtnClick() {
        stopTime = Date.now();
        nextBtn.removeEventListener("click", nextBtnClick);
        params.masterCSV += `,${clickTime - startTime},${stopTime - startTime},${selection}`;
        console.log(params.masterCSV);
        Utility.fadeOut(page)
            .then(() => {
                jumbos.forEach(jumbo => jumbo.style.display = "block");
                callback();
            });
    }

    span.innerHTML = params.participant.codes[params.state];
    params.state++;
    jumbos.forEach(jumbo => jumbo.style.display = "none");
    nextBtn.addEventListener("click", nextBtnClick);
    nextBtn.disabled = true;
    buttonScale.create();
    Utility.fadeIn(page)
        .then(() => startTime = Date.now());
}

// eslint-disable-next-line no-unused-vars
function doCanvasScalePage(callback) {
    const page = document.getElementById("scale-page");
    const nextBtn = page.querySelector("button.next-btn");
    const jumbos = document.querySelectorAll(".jumbotron");
    const span = page.querySelector(".code-span");
    let startTime, clickTime, stopTime, selection, canvas;

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
        canvas = new fabric.Canvas("c");

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
                    fontSize: 18,
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
                    value,
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
                clickTime = Date.now();
                selection = options.target.value;
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
        stopTime = Date.now();
        nextBtn.removeEventListener("click", nextBtnClick);
        canvas.dispose(); // Removes objects and event handlers http://fabricjs.com/docs/fabric.Canvas.html#dispose
        params.masterCSV += `,${clickTime - startTime},${stopTime - startTime},${selection}`;
        console.log(params);
        Utility.fadeOut(page)
            .then(() => {
                jumbos.forEach(jumbo => jumbo.style.display = "block");
                callback();
            });
    }

    span.innerHTML = params.participant.codes[params.state];
    params.state++;
    jumbos.forEach(jumbo => jumbo.style.display = "none");
    nextBtn.addEventListener("click", nextBtnClick);
    nextBtn.disabled = true;
    doCanvasScale();
    Utility.fadeIn(page)
        .then(() => startTime = Date.now());
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

function doInstructions2Page(callback) {
    const page = document.getElementById("instructions-2-page");
    const span = page.querySelector(".code-span");

    function keyDown(evt) {
        if (evt.keyCode === 32) {
            document.body.removeEventListener("keydown", keyDown);
            evt.preventDefault();
            evt.stopPropagation();
            Utility.fadeOut(page)
                .then(callback);
            return false;
        }
    }

    span.innerHTML = params.participant.codes[params.state];
    params.state++;
    document.body.addEventListener("keydown", keyDown);
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

function doCountdownPage(callback, result) {
    const page = document.getElementById("countdown-page");
    const timeHeader = page.querySelector("h1");
    let countDown = result.countDown;
    let countDownIntervalTimer;

    function getCountDownString() {
        let mins = (Math.floor(countDown / 60)).toString();
        let secs = (countDown % 60).toString();
        if (secs.length < 2) {
            secs = `0${secs}`;
        }
        return `${mins}:${secs}`;
    }

    countDownIntervalTimer = window.setInterval(() => {
        countDown--;
        timeHeader.innerHTML = getCountDownString();
        if (countDown === 0) {
            window.clearInterval(countDownIntervalTimer);
            countDownIntervalTimer = null;
            Utility.fadeOut(page)
                .then(callback);
        }
    }, 1000);

    timeHeader.innerHTML = getCountDownString();
    (page.querySelector(".msg-div")).innerHTML = result.msg;
    Utility.fadeIn(page);
    console.log(result);
}

function prepareDelay2Min(callback) {
    callback(null, {
        countDown: 10,
        msg: "Now you have 2 min break. You will be able to continue with the task once the countdown on the timer is completed."
    });
}

async function doGoodbyePage() {
    console.log("Do goodbye page");

    const page = document.getElementById("goodbye-page");
    const logo = document.querySelector(".feast-footer-logo");
    const serverFeedback = document.querySelector(".server-feedback");

    function logoTap() {
        logo.removeEventListener("click", logoTap);
        window.location.reload();
    }

    logo.addEventListener("click", logoTap);
    Utility.fadeIn(page);
    serverFeedback.innerHTML = await Utility.postPilotCSV(params.masterCSV);
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
    console.log(words);
    Utility.shuffleArray(words);
    console.log(words);
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
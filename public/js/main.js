import * as Utility from "./utility.mjs";

const tasks = [doIntroPage, doBlock1, doInterBlockPage, doBlock2, doGoodbyePage];
/* const emojiFiles = ["emoji/Angry face.svg", "emoji/Anguished face.svg", "emoji/Astonished face.svg", "emoji/Cold face.svg", "emoji/Face screaming in fear.svg",
    "emoji/Grinning face.svg", "emoji/Kissing face with closed eyes.svg", "emoji/Smiling face.svg"]; */
const emojis = [];
const emojiArray = [
    {
        path: "emoji/Angry face.svg",
        label: "angry"
    }, {
        path: "emoji/Anguished face.svg",
        label: "anguished"
    }, {
        path: "emoji/Astonished face.svg",
        label: "astonished"
    }, {
        path: "emoji/Cold face.svg",
        label: "cold"
    }, {
        path: "emoji/Face screaming in fear.svg",
        label: "fear"
    }, {
        path: "emoji/Grinning face.svg",
        label: "grinning"
    }, {
        path: "emoji/Kissing face with closed eyes.svg",
        label: "kissing"
    }, {
        path: "emoji/Smiling face.svg",
        label: "smiling"
    }
];
const words = ["Happy", "Sad", "Disgust", "Anger", "Fear", "Love", "Hate"];
const params = {
    mode: "",
    order: "",
    emojiCSV: "",
    wordsCSV: ""
};

function doEmojiPage(callback) {
    const ITI = 500;
    const ON_TIME = 3000;
    const page = document.getElementById("emoji-page");
    const emojiImg = page.querySelector("img");
    let currentImage = 0;
    let startTime = 0;
    let timer;
    let validKeys;
    let jumbotrons;
    let ignoreKeypresses = true;

    function endTrial(timedOut, responseTime, response) {
        console.log(responseTime, "ms");
        params.emojiCSV += `,"${emojiArray[currentImage - 1].label}","${timedOut}",${Math.round(responseTime)},"${response}"`;
        if (timer) {
            window.clearTimeout(timer);
            timer = null;
        }
        if (currentImage < emojiArray.length) {
            doTrial();
        }
        else {
            console.log("Emoji done", timer, currentImage);
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
        console.log("Emoji page keypress");
        if (ignoreKeypresses) {
            return;
        }
        if (validKeys[evt.keyCode]) {
            endTrial("F", Date.now() - startTime, validKeys[evt.keyCode]);
        }
    }

    async function doTrial() {
        ignoreKeypresses = true;
        emojiImg.style.visibility = "hidden";
        emojiImg.src = emojiArray[currentImage++].path;
        await Utility.wait(ITI);
        window.requestAnimationFrame(() => {
            emojiImg.style.visibility = "visible";
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
    emojiImg.style.visibility = "hidden";
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

function doBlock1(callback) {
    switch (params.order) {
        case "order-1": doEmojiPage(callback);
            break;
        case "order-2": doWordsPage(callback);
            break;
    }
}

function doBlock2(callback) {
    switch (params.order) {
        case "order-1": doWordsPage(callback);
            break;
        case "order-2": doEmojiPage(callback);
            break;
    }
}

function doIntroPage(callback) {
    const page = document.getElementById("landing-page");
    const nextBtn = page.querySelector("button.next-btn");

    function nextBtnClick() {
        nextBtn.removeEventListener("click", nextBtnClick);
        params.mode = page.querySelector('input[name="mode-radio"]:checked').value;
        params.order = page.querySelector('input[name="order-radio"]:checked').value;
        console.log(params);
        Utility.fadeOut(page)
            .then(callback);
    }

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

function preloadImages() {
    let image;
    for (let item of emojiArray) {
        image = new Image();
        image.src = item.path;
        emojis.push(image);
    }
    console.log(emojis);
}

function run() {
    console.log("Running.");
    preloadImages();
    document.body.style.overflow = "hidden";
    nextTask();
}

console.log("FEAST V1");
Utility.ready(run);
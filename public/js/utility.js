function fadeOut(el) {
    el.style.opacity = 1;

    return new Promise(function (resolve) {
        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
                el.style.display = "none";
                resolve();
            } else {
                requestAnimationFrame(fade);
            }
        })();
    });
}

function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";

    return new Promise(function (resolve) {
        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += .1) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            } else {
                resolve();
            }
        })();
    });
}

function ready(callback) {
    if (document.readyState !== "loading") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}

/* async function postCSV(csv, condition) {
    const data = {
        csv,
        condition
    };
    const resp = await fetch("/submit", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).catch(function (err) {
        console.log("Failed to POST csv.");
        console.log(err);
    });

    if (!resp.ok) {
        throw Error("POST csv failed server side.");
    }
    return await resp.text();
} */

async function postCSV(csv) {
    const data = {
        csv
    };
    fetch("feast/submit", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).catch(function (err) {
        console.log("Failed to POST csv.");
        console.log(err);
    });
}

async function postPilotCSV(csv) {
    const data = {
        csv
    };
    const response = await fetch("feast/submitPilot", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    const text = await response.text();
    console.log("Response:", text);
    return text;
}

function sanatise(str, length) {
    let text = str.trim().replace(/(\r\n|\n|\r)/gm, " ").replaceAll(",", ";");
    text = text.replaceAll("\"", "'");
    const trimmed = text.length > length ? text.substring(0, length) : text;
    return trimmed;
}

function wait(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function hideJumbos() {
    document.querySelectorAll(".jumbotron").forEach(jumbo => jumbo.style.display = "none");
}

function showJumbos() {
    document.querySelectorAll(".jumbotron").forEach(jumbo => jumbo.style.display = "block");
}

const emotionWords = [
    "Adventurous",
    "Bored",
    "Cheap",
    "Classy",
    "Comforted",
    "Energised",
    "Feminine",
    "Genuine",
    "Happy",
    "Inspired",
    "Irritated",
    "Masculine",
    "Modern",
    "Pretentious",
    "Relaxed",
    "Sensual",
    "Simple",
    "Sophisticated",
    "Traditional",
    "Uninspired"
];

export {
    fadeIn,
    fadeOut,
    ready,
    postCSV,
    postPilotCSV,
    sanatise,
    wait,
    shuffleArray,
    hideJumbos,
    showJumbos,
    emotionWords
};
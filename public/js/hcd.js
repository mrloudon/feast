import * as Utility from "./utility.js";
import * as Calibration from "./calibration.js";
import * as FalsePositives from "./falsePositive.js";
import * as Product from "./product.js";
import { loadCataData } from "./cata.js";

const bodyKeys = {
    keyX: false,
    shiftLeft: false
};

let session = false;
let participantId = false;
let cataData;
let falsePositiveData;

async function loadFalsePositiveData() {
    const falsePositiveStream = await fetch(`falsePositives?id=${participantId}`);
    falsePositiveData = await falsePositiveStream.json();
    console.log("Flase positive data loaded.");
}

async function doLandingPage() {
    const page = document.getElementById("landing-page");
    const input = page.querySelector("input");
    const nextBtn = page.querySelector("button.next-btn");
    const tds = page.querySelectorAll("td");
    const idTh = page.querySelector(".table-id");
    const rbs = page.querySelectorAll(".form-check-input");

    session = false;
    participantId = false;
    cataData = await loadCataData();

    return new Promise(function (resolve) {

        async function nextBtnClick() {
            console.log(participantId);
            await loadFalsePositiveData();
            console.log(falsePositiveData);

            nextBtn.removeEventListener("click", nextBtnClick);
            input.removeEventListener("input", inputChange);
            rbs.forEach(rb => rb.removeEventListener("click", rbClick));
            Utility.fadeOut(page)
                .then(resolve);
        }

        function inputChange() {
            participantId = parseInt(input.value, 10);
            if (typeof participantId === "number" && participantId > 0 && participantId <= 120) {
                idTh.innerHTML = participantId;
                for (let i = 0; i < tds.length; i++) {
                    tds[i].innerHTML = cataData[participantId - 1].cata[i];
                }
                nextBtn.disabled = false;
            }
            else {
                participantId = false;
                idTh.innerHTML = "&mdash;";
                tds.forEach(t => t.innerHTML = "&mdash;");
                nextBtn.disabled = true;
            }
            nextBtn.disabled = !(participantId && session);
        }

        function rbClick(event) {
            console.log(event.target.value);
            session = event.target.value;
            nextBtn.disabled = !(participantId && session);
        }

        input.addEventListener("input", inputChange);
        nextBtn.addEventListener("click", nextBtnClick);
        rbs.forEach(rb => rb.addEventListener("click", rbClick));

        nextBtn.disabled = true;

        Utility.fadeIn(page)
            .then(() => input.focus());
    });


}

function doWelcomePage() {
    const page = document.getElementById("welcome-page");
    const nextBtn = page.querySelector("button.next-btn");

    return new Promise(function (resolve) {
        function nextBtnClick() {
            nextBtn.removeEventListener("click", nextBtnClick);
            Utility.fadeOut(page)
                .then(() => {
                    Utility.showJumbos();
                    resolve();
                });
        }

        Utility.hideJumbos();
        nextBtn.addEventListener("click", nextBtnClick);
        Utility.fadeIn(page);
    });
}

function doPracticeCompletedPage() {
    const page = document.getElementById("practice-completed-1-page");
    const nextBtn = page.querySelector(".next-btn");

    return new Promise(function(resolve){
        function nextBtnClick() {
            nextBtn.removeEventListener("click", nextBtnClick);
            Utility.fadeOut(page)
                .then(resolve);
        }
    
        nextBtn.addEventListener("click", nextBtnClick);
        Utility.fadeIn(page);
    });
}

async function run() {

    function initialise(){
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
    }

    console.log("Running.");
    initialise();

    await doLandingPage();
    await Product.doProduct();
    await doWelcomePage();
    await Calibration.doCalibrationTask();
    await FalsePositives.doFalsePositiveTask(falsePositiveData);
    await doPracticeCompletedPage();
    await Product.doProduct();
    
    console.log("Done.");
}

console.log("FEAST V1");
Utility.ready(run);
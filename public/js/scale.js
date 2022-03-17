import * as Utility from "./utility.js";

const tasks = [doScalePage];

const emojiNames = [
    "dislike-extremely.png",
    "dislike-very-much.png",
    "dislike-moderately.png",
    "dislike-slightly.png",
    "neither-like-nor-dislike.png",
    "like-slightly.png",
    "like-moderately.png",
    "like-very-much.png",
    "like-extremely.png"
];

const textNames = [
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

let emojiImages = [];

function doScalePage(){
    const page = document.getElementById("scale-page");
    const title = page.querySelector("h1");
    const emojiScaleDiv = page.querySelector(".emoji-scale-div");
    const textScaleDiv = page.querySelector(".text-scale-div");
    const textPointerDiv = page.querySelector(".text-pointer-div");
    let emojiScaleItems;
    let emojiScaleHTML = "";
    let textScaleItems;
    let textScaleHTML = "";
    let pointerHTML = "";
    let pointerScaleItems;
    let i = 0;

    function emojiItemClick(evt){
        console.log("emoji click");
        let item = evt.currentTarget;
        const id = item.dataset.id;
        emojiScaleItems.forEach(item => {
            item.style.border = "solid 1px #fefefe";
            item.style.backgroundColor = "#fefefe";
        });
        item.style.border = "solid 1px #666";
        item.style.backgroundColor = "yellow";
        title.innerHTML = id;
    }

    function textItemClick(evt){
        console.log("btn click");
        let item = evt.currentTarget;
        const id = item.dataset.id;
        textScaleItems.forEach(item => {
            item.classList.remove("btn-warning");
            item.classList.add("btn-primary");
        });
        item.classList.remove("btn-primary");
        item.classList.add("btn-warning");
        pointerScaleItems.forEach(item => item.style.visibility = "hidden");
        pointerScaleItems[id].style.visibility = "visible";
        title.innerHTML = id;
    }

    emojiNames.forEach(imgName => {
        const imgHTML = `
            <div class="col text-center emoji-scale-item" data-id="${i}">
                <img width="60" height="60" src="./img/${imgName}">
            </div>
        `;
        const btnHTML = `<button type="button" class="col btn btn-primary text-scale-item" data-id="${i}">${textNames[i]}</button>`;
        const triangleHTML = `<div class="col">
                                <div class="triangle-down"></div>
                            </div>`;
        emojiScaleHTML += imgHTML;
        textScaleHTML += btnHTML;
        pointerHTML += triangleHTML;
        i++;
    });
    emojiScaleDiv.innerHTML = emojiScaleHTML;
    textScaleDiv.innerHTML = textScaleHTML;
    textPointerDiv.innerHTML = pointerHTML;

    emojiScaleItems = page.querySelectorAll(".emoji-scale-item");
    emojiScaleItems.forEach(item => item.addEventListener("click", emojiItemClick));

    textScaleItems = page.querySelectorAll(".text-scale-item");
    textScaleItems.forEach(item => item.addEventListener("click", textItemClick));

    pointerScaleItems = page.querySelectorAll(".triangle-down");

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

function run(){
    emojiNames.forEach(name => {
        const img = new Image();
        img.src = `./img/${name}`;
        emojiImages.push(img);
    });
    nextTask();
}

Utility.ready(run);
/* global fabric */

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

let emojiImages = [];


function doScalePage() {
    const page = document.getElementById("scale-page");
    const title = page.querySelector("h1");
    const emojiScaleDiv = page.querySelector(".emoji-scale-div");
    const textScaleDiv1 = page.querySelector(".text-scale-div-1");
    const textScaleDiv2 = page.querySelector(".text-scale-div-2");
    const textPointerDiv = page.querySelector(".text-pointer-div");
    let emojiScaleItems;
    let emojiScaleHTML = "";

    function doCanvasScale() {

        const canvas = new fabric.Canvas("c");

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
                    pointerX: pointerX
                });
                canvas.add(text);
                textX += 120;
                pointerX += 120;
                value++;
            });
        }

        const rect = new fabric.Rect({
            left: 20,
            top: 180,
            fill: "#666",
            width: 965,
            height: 5
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
        });

        canvas.on("mouse:down", function (options) {
            if (options.target) {
                title.innerHTML = `Value: ${options.target.value}`;
                pointer.left = options.target.pointerX;
                pointer.visible = true;
            }
        });

        canvas.hoverCursor = "pointer";
        canvas.add(rect);
        canvas.add(pointer);
        buildTexts();
    }

    function doEmojiScale() {
        let i = 0;

        function emojiItemClick(evt) {
            console.log("emoji click");
            let item = evt.currentTarget;
            const id = item.dataset.id;
            emojiScaleItems.forEach(item => {
                item.style.border = "solid 1px #fefefe";
                item.style.backgroundColor = "#fefefe";
            });
            item.style.border = "solid 1px #666";
            item.style.backgroundColor = "yellow";
            title.innerHTML = `Value: ${id}`;
        }

        emojiNames.forEach(imgName => {
            const imgHTML = `
                <div class="col text-center emoji-scale-item" data-id="${i}">
                    <img width="60" height="60" src="./img/${imgName}">
                </div>
            `;

            emojiScaleHTML += imgHTML;
            i++;
        });

        emojiScaleDiv.innerHTML = emojiScaleHTML;
        emojiScaleItems = page.querySelectorAll(".emoji-scale-item");
        emojiScaleItems.forEach(item => item.addEventListener("click", emojiItemClick));
    }

    function doText1Scale() {
        let textScaleItems;
        let textScaleHTML = "";
        let i = 0;

        function textItemClick(evt) {
            console.log("btn click");
            let item = evt.currentTarget;
            const id = item.dataset.id;
            textScaleItems.forEach(item => {
                item.classList.remove("btn-warning");
                item.classList.add("btn-primary");
            });
            item.classList.remove("btn-primary");
            item.classList.add("btn-warning");
            title.innerHTML = `Value: ${id}`;
        }

        textNamesHTML.forEach(captionHTML => {
            const btnHTML = `<button type="button" class="col btn btn-primary text-scale-item" data-id="${i}">${captionHTML}</button>`;
            textScaleHTML += btnHTML;
            i++;
        });

        textScaleDiv1.innerHTML = textScaleHTML;

        textScaleItems = page.querySelectorAll(".text-scale-div-1 .text-scale-item");
        textScaleItems.forEach(item => item.addEventListener("click", textItemClick));
    }


    function doText2Scale() {
        let textScaleItems;
        let textScaleHTML = "";
        let pointerHTML = "";
        let pointerScaleItems;
        let i = 0;

        function textItemClick(evt) {
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
            title.innerHTML = `Value: ${id}`;
        }

        textNamesHTML.forEach(captionHTML => {
            const btnHTML = `<button type="button" class="col btn btn-primary text-scale-item" data-id="${i}">${captionHTML}</button>`;
            const triangleHTML = `<div class="col">
                                    <div class="triangle-down"></div>
                                </div>`;
            textScaleHTML += btnHTML;
            pointerHTML += triangleHTML;
            i++;
        });
        console.log(textScaleHTML);

        textScaleDiv2.innerHTML = textScaleHTML;
        textPointerDiv.innerHTML = pointerHTML;

        textScaleItems = page.querySelectorAll(".text-scale-div-2 .text-scale-item");
        textScaleItems.forEach(item => item.addEventListener("click", textItemClick));
        pointerScaleItems = page.querySelectorAll(".triangle-down");
    }

    doEmojiScale();
    doText1Scale();
    doText2Scale();
    doCanvasScale();

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
    emojiNames.forEach(name => {
        const img = new Image();
        img.src = `./img/${name}`;
        emojiImages.push(img);
    });
    nextTask();
}

Utility.ready(run);
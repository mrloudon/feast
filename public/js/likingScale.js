let textScaleItems;
let textScaleHTML = "";
let callback;

function textItemClick(evt) {
    let item = evt.currentTarget;
    const id = item.dataset.id;
    textScaleItems.forEach(item => {
        item.classList.remove("btn-warning");
        item.classList.add("btn-primary");
    });
    item.classList.remove("btn-primary");
    item.classList.add("btn-warning");
    callback(id);
}

function doLikingScalePage(page, cb) {

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


    let i = 0;
    callback = cb;


    textNamesHTML.forEach(captionHTML => {
        const btnHTML = `<button type="button" class="col btn btn-primary text-scale-item" data-id="${i}">${captionHTML}</button>`;
        textScaleHTML += btnHTML;
        i++;
    });

    textScaleDiv1.innerHTML = textScaleHTML;
    textScaleItems = page.querySelectorAll(".text-scale-div-1 .text-scale-item");
    textScaleItems.forEach(item => item.addEventListener("click", textItemClick));
}

function removeEventListeners() {
    textScaleItems.forEach(item => item.removeEventListener("click", textItemClick));
}

export { doLikingScalePage, removeEventListeners };
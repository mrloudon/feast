import * as Utility from "./utility.js";

let cataData, callback, index, sample;

const headers = [
    `<ol>
        <li>Please cleans your palate with a bite of crackers and few sips of water.</li>
        <li>Now taste the whole volume in one cup of <strong>sample <span class="sample-span"></span></strong> and select all applicable emotion words from the list below.</li>
    </ol>`,
    `<ol>
        <li>Please cleans your palate with a bite of crackers and few sips of water.</li>
        <li>Now taste the whole volume in one cup of <strong>sample <span class="sample-span"></span></strong> and select all applicable sensory attributes from the list below.</li>
    </ol>`
];

function doResponsePage() {
    const page = document.getElementById("cata-response-page");
    const buttons = page.querySelectorAll(".text-scale-item");
    const nextBtn = page.querySelector(".next-btn");

    page.querySelector(".cata-header-div").innerHTML = headers[index];
    page.querySelector(".sample-span").innerHTML = sample;

    function buttonClick(evt) {
        evt.currentTarget.checked = !evt.currentTarget.checked;
        console.log(evt.currentTarget.checked);
        if (evt.currentTarget.checked) {
            evt.currentTarget.classList.add("btn-success");
            evt.currentTarget.classList.remove("btn-danger");
        }
        else {
            evt.currentTarget.classList.add("btn-danger");
            evt.currentTarget.classList.remove("btn-success");
        }
    }

    function removeListeners() {
        nextBtn.removeEventListener("click", nextBtnClick);
        buttons.forEach(btn => btn.removeEventListener("click", buttonClick));
    }

    function nextBtnClick() {
        let result = ",";
        buttons.forEach(btn => {
            if (btn.checked) {
                result += `${btn.innerHTML} `;
            }
        });
        removeListeners();
        console.log(result);
        Utility.fadeOut(page)
            .then(callback);
    }

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("btn-success");
        buttons[i].classList.add("btn-danger");
        buttons[i].innerHTML = cataData[index].cata[i];
        buttons[i].checked = false;
        buttons[i].addEventListener("click", buttonClick);
    }

    nextBtn.addEventListener("click", nextBtnClick);
    Utility.fadeIn(page);
    console.log(cataData[index]);
}

function doCataTask(i, s, cb) {
    callback = cb;
    index = i;
    sample = s;
    doResponsePage();
}

async function loadCataData(){
    const cataStream = await fetch("cata");
    cataData = await cataStream.json();
    console.log("CATA data loaded.");
    return cataData;
}



export { doCataTask, loadCataData };
import * as Utility from "./utility.js";

let cataDataIndices, index, sample;

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

const emotionWords = [
    "Adventurous",
    "Boring",
    "Cheap",
    "Classy",
    "Comforting",
    "Energetic",
    "Feminine",
    "Genuine",
    "Happy",
    "Inspired",
    "Irritated",
    "Masculine",
    "Modern",
    "Pretentious",
    "Relaxing",
    "Sensual",
    "Simple",
    "Sophisticated",
    "Traditional",
    "Uninspired"
];

const sensoryWords = [
    "Bean-like flavour",
    "Cardboard-like",
    "Creamy mouthfeel",
    "Grain/wheat flavour",
    "Milk-like flavour",
    "Nutty flavour",
    "Oaty/cereal flavour",
    "Rice flavour",
    "Strong flavour",
    "Sweet taste",
    "Thick/viscous",
    "Thin/watery",
    "Weak/bland flavour",
    "White appearance",
    "Earthy",
    "Hay-like",
    "Roasty",
    "Salty",
    "Bitter",
    "Metallic",
    "Umami",
    "Astringent"
];

const stimWords = [emotionWords, sensoryWords];

function doResponsePage() {

    const cataWordList = stimWords[index];

    return new Promise(function (resolve) {
        const page = document.getElementById("cata-response-page");
        const buttons = page.querySelectorAll(".text-scale-item");
        const nextBtn = page.querySelector(".next-btn");

        page.querySelector(".cata-header-div").innerHTML = headers[index];
        page.querySelector(".sample-span").innerHTML = sample;

        function noSelectionMade() {
            for (let btn of buttons) {
                if (btn.checked) {
                    return false;
                }
            }
            return true;
        }

        function buttonClick(evt) {
            evt.currentTarget.checked = !evt.currentTarget.checked;
            if (evt.currentTarget.checked) {
                evt.currentTarget.classList.add("btn-success");
                evt.currentTarget.classList.remove("btn-danger");
            }
            else {
                evt.currentTarget.classList.add("btn-danger");
                evt.currentTarget.classList.remove("btn-success");
            }
            nextBtn.disabled = noSelectionMade();
        }

        function removeListeners() {
            nextBtn.removeEventListener("click", nextBtnClick);
            buttons.forEach(btn => btn.removeEventListener("click", buttonClick));
        }

        function nextBtnClick() {
            let result = ",";
            buttons.forEach(btn => {
                if (btn.checked) {
                    result += `${btn.innerHTML};`;
                }
            });
            removeListeners();
            result = result.slice(0, -1);
            console.log(result);
            Utility.fadeOut(page)
                .then(() => resolve(result));
        }

        buttons.forEach(btn => {
            btn.classList.add("invisible");
            btn.addEventListener("click", buttonClick);
            btn.checked = false;
            btn.classList.remove("btn-success");
            btn.classList.add("btn-danger");
        });

        for (let i = 0; i < cataDataIndices.cata.length; i++) {
            buttons[i].classList.remove("invisible");
            buttons[i].innerHTML = cataWordList[parseInt(cataDataIndices.cata[i], 10) - 1];
        }

        nextBtn.disabled = true;
        nextBtn.addEventListener("click", nextBtnClick);
        Utility.fadeIn(page);
    });
}

function doCataTask({ headerIndex, sampleCode, cataData }) {
    cataDataIndices = cataData;
    console.log(cataDataIndices);
    sample = sampleCode;
    index = headerIndex;
    return doResponsePage();
}

export { doCataTask };
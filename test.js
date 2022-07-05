const fs = require("fs");

const N_PARICIPANTS = 120;

const sequences = [];
const emotionSequences = [];

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

for (let i = 0; i < N_PARICIPANTS / 2; i++) {
    sequences.push("1");
    sequences.push("2");
}

console.log(sequences.length);

shuffle(sequences);

let logger = fs.createWriteStream("emotionSequence.csv", { flags: "a" });

for (let i = 0; i < N_PARICIPANTS; i++) {
    emotionSequences.push({
        id: (i + 1),
        sequence: sequences[i]
    });
    logger.write(`${i + 1}, ${sequences[i]}\n`);
}

logger.end();
let n = 0;

emotionSequences.forEach(seq => {
    if (seq.sequence === "1") {
        n++;
    }
});

console.log(n, emotionSequences.length);
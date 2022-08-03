

function makeIntensionCsvHeader(sampleNumber) {
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
    let csv = "";

    emotionWords.forEach(word => {
        csv += `,${sampleNumber} ${word},${sampleNumber} ${word}`;
    });

    return csv;
}

let csv = makeIntensionCsvHeader(1);

console.log(csv);
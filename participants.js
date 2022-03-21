/* eslint-env node */

const fs = require("fs");
const readline = require('readline');


async function readParticipants() {
    const participants = [];
    let id = "";
    let currentParticipant;
    const stream = fs.createReadStream("./participants.txt");
    const rl = readline.createInterface({
        input: stream
    });

    for await (const line of rl) {
        const participant = line.split("\t");
        if (participant[0] !== id) {      // New participant
            id = participant[0];
            if(currentParticipant){
                participants.push(currentParticipant);
            }
            currentParticipant = {
                id,
                codes: []
            };
        }
        currentParticipant.codes.push(participant[1]);
        currentParticipant.codes.push(participant[2]);
        currentParticipant.codes.push(participant[3]);
        currentParticipant.codes.push(participant[4]);
    }
    if(currentParticipant){
        participants.push(currentParticipant);
    }
    return participants;
}

async function run() {
    let ids = await readParticipants();
    console.log(ids);
}

run();
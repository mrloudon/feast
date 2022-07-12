
const MIN_ITI = 400;
const MAX_ITI = 1000;

function getITI() {
    return Math.floor(Math.random() * (MAX_ITI - MIN_ITI) + MIN_ITI);
    //return ITI;
}

for(let i = 0; i < 20; i++){
    console.log(getITI());
}
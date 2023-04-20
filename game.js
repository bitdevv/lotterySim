import * as util from "./util.js";
//DOM elements
const userMainNumberDiv = document.getElementById("userNumbers").querySelector("#main");
const userExtraNumberDiv = document.getElementById("userNumbers").querySelector("#extra");
const mainSelects = userMainNumberDiv.getElementsByTagName("select")
const extraSelects = userExtraNumberDiv.getElementsByTagName("select")
const generateUserNumbersBtn = document.getElementById("generateUserNumbers")
const statsDiv = document.getElementById("stats");
const gamesToPlay = document.getElementById("playAmount");
const playOnceBtn = document.getElementById("playOnceBtn");
const playManyTimesBtn = document.getElementById("playManyTimesBtn");
const winningNumbersDiv = document.getElementById("winningNumbers");
const runTimeStats = document.getElementById("runTime");
let stopMatchValue = "52";

//Initializing

//Generate numbers
generateNumbers(util.userNumbers);
//Draw user numbers
populateUserSelects();


//Load previous data
if (load()) {
    updateUserSelectedNumbers(false);
    updateStatsDom();
} else {
    //New game
    updateUserSelectedNumbers(true);
}

//
gamesToPlay.addEventListener("change", setTimesToPlayBtnText);
setTimesToPlayBtnText();
//populate validMatches select
const whenStopSelect = document.getElementById("whenStop")

for (const value of util.validMatches) {
    let text = value[0] + "+" + value[1]
    let option = document.createElement("option");
    option.id = "stop-" + value;
    option.value = value;
    option.textContent = text;
    whenStopSelect.appendChild(option)
}

whenStopSelect.addEventListener('change', function(){
    stopMatchValue = whenStopSelect.value;
    setTimesToPlayBtnText();
});
//Logig and other code


//play once

playOnceBtn.addEventListener('click', function () {
    generateNumbers(util.drawNumbers);
    evaluateLotteryGame();
    updateWinningNumbersDom();
    updateStatsDom();
    setTimesToPlayBtnText();
    save();
});

//Play many times

playManyTimesBtn.addEventListener('click', function () {
    const start = performance.now();
    let index;
    for (index = 0; index < gamesToPlay.value; index++) {
        generateNumbers(util.drawNumbers);
        if(evaluateLotteryGame()){
            break;
        }
    }
    updateWinningNumbersDom();
    updateStatsDom();
    setTimesToPlayBtnText();
    save();
    const end = performance.now();
    const duration = end - start;

    runTimeStats.innerText = `Lottery took ${duration} milliseconds to run ${index.toLocaleString()} times`;
    //console.log(`Lottery took ${duration} milliseconds to run ${gamesToPlay.value} times`);
});

let additionalStats = document.getElementById("additionalStats");
let statsText = document.getElementById("statsText");
statsText.addEventListener('click', function (){
    if (additionalStats.style.display === "none") {
        //additionalStats.style.display = "flex";

    } else {
        //additionalStats.style.display = "none";
    }
    if (additionalStats.classList.contains("active")) {
        additionalStats.classList.remove("active");
      } else {
        additionalStats.classList.add("active");
      }
});

//Methods

function setTimesToPlayBtnText(){
    playManyTimesBtn.textContent  = 'Play up to ' + Number(gamesToPlay.value).toLocaleString()+' times or stop on ' + stopMatchValue[0] + '+' + stopMatchValue[1] + ' match' 
}

function updateStatsDom() {
    for (let key in util.statistics) {
        let div = statsDiv.querySelector("#stats-" + key);
        let value = util.statistics[key];
        div.textContent = value.toLocaleString();
    }

}

function evaluateLotteryGame() {
    let mainHits = 0;
    let extraHits = 0;

    util.drawNumbers.main.forEach(mainNumber => {
        if (util.userNumbers.main.indexOf(mainNumber) !== -1) {
            mainHits++;
        }
    });
    util.drawNumbers.extra.forEach(mainNumber => {
        if (util.userNumbers.extra.indexOf(mainNumber) !== -1) {
            extraHits++;
        }
    });

    let matchCode = mainHits + '' + extraHits;
    //update numbers match stats
    if (mainHits + extraHits == 0) {
        util.statistics[matchCode]++;
        util.statistics['NA']++;
    } else {
        if (util.statistics.hasOwnProperty(matchCode)) {
            util.statistics[matchCode]++;
            let winAmount = util.monetaryData[matchCode]
            util.statistics.totalWin += winAmount;
            util.statistics.netWinnings += winAmount;
        } else {
            util.statistics['NA']++;
        }

    }
    util.statistics.netWinnings -= util.monetaryData.ticketCost;
    util.statistics.totalTicketCost += util.monetaryData.ticketCost;
    util.statistics['totalGames']++;

    return matchCode == stopMatchValue;

}

function updateWinningNumbersDom() {
    let mainNumbers = winningNumbersDiv.querySelectorAll("div[id^='main']");
    let extraNumbers = winningNumbersDiv.querySelectorAll("div[id^='extra']");
    for (let index = 0; index < mainNumbers.length; index++) {
        let div = mainNumbers[index];
        let lotteryNumber = util.drawNumbers.main[index];
        div.innerText = lotteryNumber;
        div.classList.toggle("match", util.userNumbers.main.indexOf(lotteryNumber) !== -1);
    }
    for (let index = 0; index < extraNumbers.length; index++) {
        let div = extraNumbers[index];
        let lotteryNumber = util.drawNumbers.extra[index];
        div.innerText = lotteryNumber;
        div.classList.toggle("match", util.userNumbers.extra.indexOf(lotteryNumber) !== -1);
        
    }

}

generateUserNumbersBtn.addEventListener('click', function () {
    updateUserSelectedNumbers(true);
});

function updateUserSelectedNumbers(generateNewNumbers) {
    if (generateNewNumbers) {
        generateNumbers(util.userNumbers);
    }

    for (let index = 0; index < util.userNumbers.main.length; index++) {
        const element = util.userNumbers.main[index];
        let select = mainSelects[index];
        select.value = element;

    }

    for (let index = 0; index < util.userNumbers.extra.length; index++) {
        const element = util.userNumbers.extra[index];
        let select = extraSelects[index];
        select.value = element;

    }
}

function populateUserSelects() {


    for (const select of mainSelects) {

        for (var i = 1; i <= util.maxNumber.main; i++) {
            var option = document.createElement("option");
            option.text = i;
            option.value = i;
            select.appendChild(option);
        }
    }

    for (const select of extraSelects) {

        for (var i = 1; i <= util.maxNumber.extra; i++) {
            var option = document.createElement("option");
            option.text = i;
            option.value = i;
            select.appendChild(option);
        }
    }



}

//console.log(userMainNumberDiv.textContent);


function generateNumbers(userNumbers) {
    userNumbers.main = [];
    userNumbers.extra = [];
    
    
    for (let index = 0; index < 5; index++) {
        util.generateRandomNumber(1, util.maxNumber.main, userNumbers.main);

    }
    //Generate 2 extra numbers
    for (let index = 0; index < 2; index++) {
        util.generateRandomNumber(1, util.maxNumber.extra, userNumbers.extra);

    }
}


function save() {
    const saveObj = {
        userNumbers: JSON.stringify(util.userNumbers),
        gameStats: JSON.stringify(util.statistics)
    }
    localStorage.setItem("lotteryV2", JSON.stringify(saveObj));
}
function load() {
    let savedData =  localStorage.getItem("lotteryV2");
    if (savedData) {
        let parsed = JSON.parse(savedData); 
        let userNumbers = JSON.parse(parsed.userNumbers);
        let stats = JSON.parse(parsed.gameStats);
        util.setUserNumbers(userNumbers);
        util.setStats(stats);

        //console.log("user numbers", userNumbers)
       // console.log("stats", stats)



        return true;
    } else {
        return false;
    }
}


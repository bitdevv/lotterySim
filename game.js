import * as util from "./util.js";
//DOM elements

const generateUserNumbersBtn = document.getElementById("generateUserNumbers")
const statsDiv = document.getElementById("stats");
const gamesToPlay = document.getElementById("playAmount");
const stopCheckbox = document.getElementById("doStop");

const playManyTimesBtn = document.getElementById("playManyTimesBtn");
const winningNumbersDiv = document.getElementById("winningNumbers");
const runTimeStats = document.getElementById("runTime");
let stopMatchValue = "52";

const userNumbersDiv = document.getElementById("userNumbers");

//Initializing

//Generate numbers
generateNumbers(util.userNumbers);
//Draw user numbers
stopCheckbox.checked = true

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




//Play many times

playManyTimesBtn.addEventListener('click', function () {
    // Disable the play button
    playManyTimesBtn.disabled = true;

    const start = performance.now();
    let index = 0;
    const games = parseInt(gamesToPlay.value, 10);
    const batchSize = Math.min(games/10, 50000); // Larger batch size to reduce function calls
    let gamesLeft = games
    const userMainSet = new Set(util.userNumbers.main);
    const userExtraSet = new Set(util.userNumbers.extra);

    let startMoney = util.statistics.netWinnings

    let stopOnPrize = stopCheckbox.checked

    function playGamesBatch() {
        let endLoop = false;


        for (let i = 0; i < batchSize && index < games; i++, index++) {
            generateNumbers(util.drawNumbers);
            if (evaluateLotteryGame(userMainSet, userExtraSet) && stopOnPrize) {
                endLoop = true;
                break;
            }
        }

        let moneyWon = ((util.statistics.netWinnings)-startMoney).toLocaleString()
        if (index < games && !endLoop) {
            runTimeStats.innerText = `Games left: ${(gamesLeft-=batchSize).toLocaleString()}. Money won so far:${moneyWon}€`;
            playManyTimesBtn.innerText = "Please wait"
            updateWinningNumbersDom();
            updateStatsDom();
            requestAnimationFrame(playGamesBatch); // Schedule next batch for next frame
        } else {
            // When done, re-enable the play button and update the DOM
            playManyTimesBtn.disabled = false;
            updateWinningNumbersDom();
            updateStatsDom();
            setTimesToPlayBtnText();
            save();

            const end = performance.now();
            const duration = (end - start);
            runTimeStats.innerText = `${index.toLocaleString()} games took ${duration}ms and gained: ${moneyWon}€ `;
        }
    }

    // Start the first batch
    requestAnimationFrame(playGamesBatch);
});

stopCheckbox.addEventListener("change", function() {
      setTimesToPlayBtnText();
      if(stopCheckbox.checked){
        whenStopSelect.disabled = false
    }else{
          whenStopSelect.disabled = true

      }

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
        statsText.textContent = "More statistics"
    } else {
        additionalStats.classList.add("active");
        statsText.textContent = "Less statistics"
      }
});

//Methods

function setTimesToPlayBtnText(){

    let text = `Play ${Number(gamesToPlay.value).toLocaleString()} games`
    if(stopCheckbox.checked){
        text = text +  ` or stop on ${stopMatchValue[0]}+${stopMatchValue[1]} match`
    }

    playManyTimesBtn.textContent  = text
}

function updateStatsDom() {
    for (let key in util.statistics) {
        console.log("#stats-" + key)
        let div = statsDiv.querySelector("#stats-" + key);
        let value = util.statistics[key];
        div.textContent = value.toLocaleString();
    }
}

const stats = util.statistics;
function evaluateLotteryGame(userMainSet, userExtraSet) {
    let mainHits = 0;
    let extraHits = 0;

    // Combine loops and check for hits
    util.drawNumbers.main.forEach(mainNumber => {
        if (userMainSet.has(mainNumber)) mainHits++;
    });

    util.drawNumbers.extra.forEach(extraNumber => {
        if (userExtraSet.has(extraNumber)) extraHits++;
    });

    let matchCode = mainHits + '' + extraHits;
    //update numbers match stats
    if (mainHits + extraHits == 0) {
        stats[matchCode]++;
        stats['NA']++;
    } else {
        if (stats.hasOwnProperty(matchCode)) {
            stats[matchCode]++;
            const winAmount = util.monetaryData[matchCode]
            stats.totalWin += winAmount;
            stats.netWinnings += winAmount;
        } else {
            stats['NA']++;
        }

    }

    const ticketCost = util.monetaryData.ticketCost
    util.statistics.netWinnings -= ticketCost;
    util.statistics.totalTicketCost += ticketCost;
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
    
    let mainNumbers = userNumbersDiv.querySelectorAll("div[id^='user-main']");
    let extraNumbers = userNumbersDiv.querySelectorAll("div[id^='user-extra']");
    
    for (let index = 0; index < mainNumbers.length; index++) {
        let div = mainNumbers[index];
        let lotteryNumber = util.userNumbers.main[index];
        div.innerText = lotteryNumber;
        
    }
    for (let index = 0; index < extraNumbers.length; index++) {
        let div = extraNumbers[index];
        let lotteryNumber = util.userNumbers.extra[index];
        div.innerText = lotteryNumber;
        
        
    }
}


//console.log(userMainNumberDiv.textContent);


function generateNumbers(lotteryNumbers) {
    lotteryNumbers.main = [];
    lotteryNumbers.extra = [];
    
    for (let index = 0; index < 5; index++) {
        util.generateRandomNumber(1, util.maxNumber.main, lotteryNumbers.main);
    }

    //Generate 2 extra numbers
    for (let index = 0; index < 2; index++) {
        util.generateRandomNumber(1, util.maxNumber.extra, lotteryNumbers.extra);

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



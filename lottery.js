var mainSelects = document.querySelectorAll("#container select[id^='main']");
var extraSelects = document.querySelectorAll("#container select[id^='extra']");

var lotteryMainDivs = document.querySelectorAll("#lottery-container div[id^='main']");
var lotteryExtraDivs = document.querySelectorAll("#lottery-container div[id^='extra']");
var statsContainer = document.getElementById("stats-container");
var gamesPlayedDiv = document.getElementById("gamesPlayed");
var userSelectedMainNumbers = [];
var userSelectedExtraNumbers = [];
var noMatches = 0;
var notWinning = 0;


const totalWinningsDiv = document.getElementById("total-winnings");
const totalTicketCost = document.getElementById("total-ticket-cost");
const netWinnings = document.getElementById("net-winnings");

var gamesPlayed = 0;

var mainRange = { min: 1, max: 50 };
var extraRange = { min: 1, max: 12 };

const monetaryData = {
    'ticketCost': 2, 
    '52':107469011,
    '51': 764670,
    '50': 143746,
    '42': 7113,
    '41': 420,
    '32': 219,
    '40': 134,
    '22': 35,
    '31': 25,
    '30': 19,
    '12': 17,
    '21': 11
}


function generateRandomNumber(min, max, selectedNumbers) {
    var randomNum = 0;
    do {
        randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (selectedNumbers.indexOf(randomNum) !== -1);

    selectedNumbers.push(randomNum);

    return randomNum;
}

window.onload = function () {

    // Function to generate options for a select element
    function generateOptions(select, min, max) {
        for (var i = min; i <= max; i++) {
            var option = document.createElement("option");
            option.value = i;
            option.text = i;
            select.appendChild(option);
        }
    }

    // Generate options for each select element
    mainSelects.forEach(function (select) {
        generateOptions(select, mainRange.min, mainRange.max);
    });

    extraSelects.forEach(function (select) {
        generateOptions(select, extraRange.min, extraRange.max);
    });



    function generateNumbers() {
        userSelectedMainNumbers = [];
        mainSelects.forEach(function (select) {
            var randomNum = generateRandomNumber(mainRange.min, mainRange.max, userSelectedMainNumbers);
            select.value = randomNum;
        });

        userSelectedExtraNumbers = [];
        extraSelects.forEach(function (select) {
            var randomNum = generateRandomNumber(extraRange.min, extraRange.max, userSelectedExtraNumbers);
            select.value = randomNum;
        });
    }

    var generateButton = document.getElementById("generate");
    generateButton.addEventListener("click", generateNumbers);
    generateNumbers();
    loadValues();
}





function addcontainerAsLog() {
    const originalContainer = document.getElementById('lottery-container');
    const newContainer = originalContainer.cloneNode(true);
    const clonedNumbers = newContainer.querySelectorAll('.number');
    for (let i = 0; i < clonedNumbers.length; i++) {
        let element = clonedNumbers[i];
        element.removeAttribute('id');
        /* while (element.classList.length > 0) {
            element.classList.remove(element.classList.item(0));
        } */

    }
    document.body.appendChild(newContainer);
}

function loosiLotoNumbrid(updateDOM) {

    gamesPlayedDiv.innerText++;
    var selectedNumbers = [];

    let mainMatches = 0;
    let extraMatches = 0;

    for (let i = 0; i < lotteryMainDivs.length; i++) {
        let div = lotteryMainDivs[i];


        const randomNum = generateRandomNumber(mainRange.min, mainRange.max, selectedNumbers);

        if (updateDOM) {
            div.innerText = randomNum;
        }
        if (userSelectedMainNumbers.indexOf(randomNum) !== -1) {
            if (updateDOM) {
                div.classList.add("match");
            }
            match = true;
            mainMatches++;
        } else if (updateDOM) {
            div.classList.remove("match")
        }
    }


    selectedNumbers = [];
    for (let i = 0; i < lotteryExtraDivs.length; i++) {
        let div = lotteryExtraDivs[i];
        const randomNum = generateRandomNumber(extraRange.min, extraRange.max, selectedNumbers);

        if (updateDOM) {
            div.innerText = randomNum;
        }
        if (userSelectedExtraNumbers.indexOf(randomNum) !== -1) {
            if (updateDOM) {
                div.classList.add("match");
            }
            match = true;
            extraMatches++;
        } else if (updateDOM) {
            div.classList.remove("match")
        }
        div.innerText = randomNum;
    }

    let matchCode = mainMatches + '' + extraMatches;
    //console.log( matchCode );

    let div = statsContainer.querySelector("#hits" + matchCode);

    if (div) {
        div.innerText++;
        let winning = monetaryData[matchCode];
        return winning;
        //addcontainerAsLog();
    } else {
        if (mainMatches + extraMatches == 0) {
            if(updateDOM){
                statsContainer.querySelector("#hitsExtraLame").innerText++;
            }else{
                noMatches++;
            }
        }
        if(updateDOM){
            statsContainer.querySelector("#hitsNA").innerText++;
        }else{
            notWinning++;
        }
    }
    return 0;
    
}

//get the input element for getting numbers once
const loosiNumbreidOnceButton = document.getElementById('generate-btn');
// Get the input element and the button element for getting numbers x amount of times
const inputElement = document.getElementById("auto-gen-amount");
const buttonElement = document.getElementById("start-auto-gen");

loosiNumbreidOnceButton.addEventListener('click', function () {
    let winnings = loosiLotoNumbrid(true);
    updateMonetaryDom(winnings, 1);

    saveValues();

});


// Add a click event listener to the button
buttonElement.addEventListener("click", function () {
    // Get the value from the input
    const start = performance.now();
    const numberOfGames = inputElement.value;
    let winnings = 0;
    noMatches = 0;
    notWinning = 0;
    for (let index = 0; index < numberOfGames-1; index++) {
        winnings += loosiLotoNumbrid(false);
    }
    winnings += loosiLotoNumbrid(true);
    updateMonetaryDom(winnings, numberOfGames)

    statsContainer.querySelector("#hitsExtraLame").innerText=+statsContainer.querySelector("#hitsExtraLame").innerText+noMatches;
    statsContainer.querySelector("#hitsNA").innerText=+statsContainer.querySelector("#hitsNA").innerText+notWinning;

    saveValues();
    
    
    
    const end = performance.now();
    const duration = end - start;
    console.log(`Lottery took ${duration} milliseconds to run ${numberOfGames} times`);

});

function updateMonetaryDom(winnings, gamesPlayed) {
    if (winnings > 0) {
        totalWinningsDiv.innerText = +totalWinningsDiv.innerText + winnings;
    }
    let gamesTicketCost = gamesPlayed * monetaryData.ticketCost;
    totalTicketCost.innerText = +totalTicketCost.innerText + gamesTicketCost;
    netWinnings.innerText = +netWinnings.innerText + winnings - gamesTicketCost;
}

//save and load

// Save data to localStorage
function saveValues() {
    const selectNumbers = document.querySelectorAll('.select-number');
    const statsValues = document.querySelectorAll('.match-value');
    const hitsNA = document.getElementById('hitsNA').textContent;
    const gamesPlayed = document.getElementById('gamesPlayed').textContent;


    const data = {};

    selectNumbers.forEach((select) => {
        data[select.id] = select.value;
    });

    statsValues.forEach((stat) => {
        data[stat.id] = stat.textContent;
    });

    data['hitsNA'] = hitsNA;
    data['gamesPlayed'] = gamesPlayed;

    data['total-winnings'] = totalWinningsDiv.textContent;
    data['total-ticket-cost'] = totalTicketCost.textContent;
    data['net-winnings'] = netWinnings.textContent;
 
    localStorage.setItem('lotteryData', JSON.stringify(data));
}

// Load data from localStorage
function loadValues() {
    const data = JSON.parse(localStorage.getItem('lotteryData'));

    if (data) {
        const selectNumbers = document.querySelectorAll('.select-number');
        const statsValues = document.querySelectorAll('.match-value');
        const hitsNA = document.getElementById('hitsNA');
        const gamesPlayed = document.getElementById('gamesPlayed');

        userSelectedMainNumbers = [];
        userSelectedExtraNumbers = [];

        selectNumbers.forEach((select) => {
            let value = data[select.id]
            
            select.value = value;
            if(select.id == "extra1" || select.id == "extra2"){
                userSelectedExtraNumbers.push(+value);
            }else{
                userSelectedMainNumbers.push(+value);
            }
            
        });

        statsValues.forEach((stat) => {
            stat.textContent = data[stat.id];
        });

        hitsNA.textContent = data['hitsNA'];
        gamesPlayed.textContent = data['gamesPlayed'];

        totalWinningsDiv.textContent = data['total-winnings'];
        totalTicketCost.textContent = data['total-ticket-cost'];
        netWinnings.textContent = data['net-winnings'];

    }
}

  // Call the functions to save and load data



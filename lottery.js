var mainSelects = document.querySelectorAll("#container select[id^='main']");
var extraSelects = document.querySelectorAll("#container select[id^='extra']");

var lotteryMainDivs = document.querySelectorAll("#lottery-container div[id^='main']");
var lotteryExtraDivs = document.querySelectorAll("#lottery-container div[id^='extra']");
var statsContainer = document.getElementById("stats-container");
var gamesPlayedDiv = document.getElementById("gamesPlayed");
var userSelectedMainNumbers = [];
var userSelectedExtraNumbers = [];

var gamesPlayed = 0;

var mainRange = { min: 1, max: 50 };
var extraRange = { min: 1, max: 12 };

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
}



const generateBtn = document.getElementById('generate-btn');

generateBtn.addEventListener('click', function () {

    loosiLotoNumbrid()

});

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

function loosiLotoNumbrid() {

    gamesPlayedDiv.innerText++;
    var selectedNumbers = [];
    let match = false;

    let mainMatches = 0;
    let extraMatches = 0;

    for (let i = 0; i < lotteryMainDivs.length; i++) {
        let div = lotteryMainDivs[i];
        div.classList.remove("match")
        const randomNum = generateRandomNumber(mainRange.min, mainRange.max, selectedNumbers);
        if (userSelectedMainNumbers.indexOf(randomNum) !== -1) {
            div.classList.add("match");
            match = true;
            mainMatches++;
        }

        
        div.innerText = randomNum;
    }

    selectedNumbers = [];
    for (let i = 0; i < lotteryExtraDivs.length; i++) {
        let div = lotteryExtraDivs[i];
        div.classList.remove("match")
        const randomNum = generateRandomNumber(extraRange.min, extraRange.max, selectedNumbers);
        if (userSelectedMainNumbers.indexOf(randomNum) !== -1) {
            div.classList.add("match")
            match = true;
            extraMatches++;
        }
        lotteryExtraDivs[i].innerText = randomNum;
    }

    let matchCode =  mainMatches + '' + extraMatches;
    console.log( matchCode );

    let div = statsContainer.querySelector("#hits" + matchCode);



    if(div){
        div.innerText++;
        addcontainerAsLog();
    }else{
        if(mainMatches+extraMatches == 0){
            statsContainer.querySelector("#hitsExtraLame").innerText++;

        }else{
            statsContainer.querySelector("#hitsNA").innerText++;

        }

    }

}

// Get the input element and the button element
const inputElement = document.getElementById("auto-gen-amount");
const buttonElement = document.getElementById("start-auto-gen");

// Add a click event listener to the button
buttonElement.addEventListener("click", function() {
  // Get the value from the input
  const amount = inputElement.value;
  for (let index = 0; index < amount; index++) {
    loosiLotoNumbrid();
  }

});
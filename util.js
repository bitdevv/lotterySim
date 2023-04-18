export let statistics = {
    "52": 0,
    "51": 0,
    "50": 0,
    "42": 0,
    "41": 0,
    "32": 0,
    "40": 0,
    "22": 0,
    "31": 0,
    "30": 0,
    "12": 0,
    "21": 0,
    "00": 0,
    "NA": 0,
    "totalWin": 0,
    "totalGames": 0,
    "totalTicketCost": 0,
    "netWinnings": 0
}

export function setStats(ststs){
    statistics = ststs;
}

export const maxNumber = {
    main: 50,
    extra: 12
}

export let userNumbers = {
    main: [],
    extra: []
}
export function setUserNumbers(userNum){
    userNumbers = userNum;
}

export const drawNumbers = {
    main: [0, 0, 0, 0, 0],
    extra: [0, 0]
}

export const monetaryData = {
    'ticketCost': 2,
    '52': 107469011,
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

export const validMatches = [
    "52",
    "51",
    "50",
    "42",
    "41",
    "32",
    "40",
    "22",
    "31",
    "30",
    "12",
    "21"
]


export function generateRandomNumber(min, max, selectedNumbers) {
    var randomNum = 0;
    do {
        //Standard implementation
        //randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

        //Optimized "fast"
        randomNum = (Math.random() * (max - min + 1) | 0) + min;
    } while (selectedNumbers.indexOf(randomNum) !== -1);

    selectedNumbers.push(randomNum);

    return randomNum;
}

export function createAndAddSelect(generatedNumber, parentDiv){
    let select = document.createElement("select");
    for (var i = 1; i <= 50; i++) {
        var option = document.createElement("option");
        option.text = i;
        option.value = i;
        if(i == generatedNumber){
            option.selected = true;
        }
        select.appendChild(option);
      }
      parentDiv.appendChild(select);
}
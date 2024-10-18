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
// Assuming the "stats" container is already in the DOM
const statsContainer = document.getElementById("stats");

export function generateStatsDom() {
    // Define labels for each statistic (if necessary)
    const labels = {
        "52": "5+2",
        "51": "5+1",
        "50": "5+0",
        "42": "4+2",
        "41": "4+1",
        "40": "4+0",
        "32": "3+2",
        "31": "3+1",
        "30": "3+0",
        "22": "2+2",
        "21": "2+1",
        "12": "1+2",
        "00": "0+0",
        "NA": "Not winning",
        "totalWin": "Total Won €",
        "totalGames": "Total Games",
        "totalTicketCost": "Ticket Cost €",
        "netWinnings": "Net Won €"
    };

    // Clear any existing content in the container
    statsContainer.innerHTML = '';

    // Create the title for the statistics section
    const title = document.createElement('h5');
    title.classList.add('w100', 'container-title', 'btn');
    title.id = 'statsText';
    title.textContent = 'More statistics';
    statsContainer.appendChild(title);

    // Create collapsible container for additional stats
    const collapsibleContainer = document.createElement('div');
    collapsibleContainer.classList.add('container', 'w100', 'collapsible');
    collapsibleContainer.id = 'additionalStats';

    // Create the main stats divs (non-collapsible)
    console.log(statistics);
    const alwaysVisibleStats = ['totalTicketCost', 'totalWin', 'netWinnings']
    for (const key in statistics) {
        // Only add specific keys (Ticket Cost, Total Won, Net Won) outside the collapsible section
        if (alwaysVisibleStats.includes(key)) {
            createStatRow(labels[key], key, statsContainer);
        }else{
            createStatRow(labels[key], key, collapsibleContainer);
        }
    }

    statsContainer.appendChild(collapsibleContainer);

    // Add event listener to toggle visibility of additional stats
    let statsText = document.getElementById("statsText");
    let additionalStats = document.getElementById("additionalStats");
    statsText.addEventListener('click', function () {
        if (additionalStats.classList.contains("active")) {
            additionalStats.classList.remove("active");
            statsText.textContent = "More statistics";
        } else {
            additionalStats.classList.add("active");
            statsText.textContent = "Less statistics";
        }
    });
}

// Function to create a row for each statistic
function createStatRow(label, key, parent) {
    const statRow = document.createElement('div');
    statRow.classList.add('border', 'row');

    const statLabel = document.createElement('div');
    statLabel.textContent = label;
    statRow.appendChild(statLabel);

    const statValue = document.createElement('div');
    statValue.classList.add('stat-value');
    statValue.id = 'stats-' + key;
    statValue.textContent = statistics[key].toLocaleString(); // Add the value

    statRow.appendChild(statValue);
    parent.appendChild(statRow);
}
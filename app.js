//BankElements
const loanButton = document.getElementById("getLoanButton");
const repayLoanButton = document.getElementById("repayLoanButton");
repayLoanButton.style.display = "none";
const balanceLabel = document.getElementById("balanceLabel");
const loanAmountEl = document.getElementById("loanAmount");

//WorkElements
const workButton = document.getElementById("workButton");
const bankButton = document.getElementById("bankButton");
const payEl = document.getElementById("pay");

//LaptopElements
const laptopEl = document.getElementById("laptops");
const laptopPrice = document.getElementById("price");
const featuresEL = document.getElementById("features");
const stockEl = document.getElementById("stock");
const imageEl = document.getElementById("laptopImage");
const payButton = document.getElementById("payButton");

//Bank
let balance = 25
let hasLoan = false;
let loanSum = 0;

//Default balance to screen
let formattedDefaultBalance = formatBalance(balance);
balanceLabel.innerText = formattedDefaultBalance;
let formattedDefaultLoan = formatBalance(loanSum);
loanAmountEl.innerText = formattedDefaultLoan;

function formatBalance(amount) {
    return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'SEK'}).format(amount);
}

//Take loan functionality
loanButton.addEventListener('click', () => {
    let loan = window.prompt("Add amount to loan");
    if (isNaN(parseInt(loan))) {
        alert("Please enter a numeric value");
    } else if (parseInt(loan) > balance * 2) {
        alert("Loan not approved");
    } else if (hasLoan == true) {
        alert("You already have a loan! Please pay it back before taking another loan.");
    } else {
        balance += parseInt(loan);
        loanSum += loan;
        let formattedBalance = formatBalance(balance);
        balanceLabel.innerText = formattedBalance;
        let formattedLoan = formatBalance(loanSum);
        loanAmountEl.innerText = formattedLoan;
        repayLoanButton.style.display = "block";
        hasLoan = true;
    }
})

//Work
let workTotal = 0;

//Default pay to screen
let formattedDefaultPay = formatBalance(0);
payEl.innerText = formattedDefaultPay;

const getWorkMoney = () => {
    workTotal += 100;
    let formattedWorkTotal = formatBalance(workTotal);
    payEl.innerText = formattedWorkTotal;
}

const bankMoney = () => {
    if (hasLoan = true) {
        loanSum -= (workTotal * 0.1);
        if (loanSum <= 0) {
            balance += Math.abs(loanSum);
            loanSum = 0;
            repayLoanButton.style.display = "none";
            hasLoan = false;
        }
        workTotal -= (workTotal * 0.1)
        balance += workTotal;
        workTotal = 0;
    }
    if(hasLoan = false) {
        balance += workTotal;
        workTotal = 0;
    }

    let formattedBalance = formatBalance(balance);
    let formattedPay = formatBalance(workTotal);
    let formattedLoan = formatBalance(loanSum);
    balanceLabel.innerText = formattedBalance;
    payEl.innerText = formattedPay;
    loanAmountEl.innerText = formattedLoan;
}

const repayLoan = () => {
    if(workTotal >= loanSum) {
        workTotal -= loanSum;
        loanSum = 0;
        balance += workTotal;
        workTotal = 0;
        repayLoanButton.style.display = "none";
        hasLoan = false;
    } else if (loanSum >= workTotal) {
        loanSum -= workTotal;
        workTotal = 0;
    } else if (workTotal === loanSum) {
        loanSum = 0;
        workTotal = 0;
        repayLoanButton.style.display = "none";
        hasLoan = false;
    }

    let formattedBalance = formatBalance(balance);
    let formattedPay = formatBalance(workTotal);
    let formattedLoan = formatBalance(loanSum);
    balanceLabel.innerText = formattedBalance;
    payEl.innerText = formattedPay;
    loanAmountEl.innerText = formattedLoan;
}

workButton.addEventListener('click', getWorkMoney);
bankButton.addEventListener('click', bankMoney);
repayLoanButton.addEventListener('click', repayLoan);

//Laptops
let laptopsArr = [];
let imageURL = "https://hickory-quilled-actress.glitch.me/";
let currentLaptopPrice = 200;
let currentLaptopId = 0;
let stockArr = [];

//Default stock
stockArr[0] = 1;
stockEl.innerText = stockArr[0];

//Adding default features to screen. Probably not the best way of doing this, look into this later
let featuresArr = [];
featuresArr[0] = `Has a screen`;
featuresArr[1] = `Keyboard works, mostly`;
featuresArr[2] = `32MB Ram (Not upgradeable)`;
featuresArr[3] = `6GB Hard Disk`;
featuresArr[4] = `Comes with Floppy Disk Reader (Free) - Requires cable`;
featuresArr[5] = `Good excersice to carry`;

for(i = 0; i< featuresArr.length; i++) {
    const featureItem = document.createElement("li");
    featureItem.innerText = featuresArr[i];
    featuresEL.appendChild(featureItem);
}

//Fetching data from json file
fetch("https://hickory-quilled-actress.glitch.me/computers")
    .then(response => response.json())
    .then(data => laptopsArr = data)
    .then(laptopsArr => addLaptopsToList(laptopsArr));

const addLaptopsToList = laptopsArr => {
    laptopsArr.forEach(x => addLaptopToList(x));
    laptopPrice.innerText = formatBalance(laptopsArr[0].price);

}

const addLaptopToList = laptop => {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    stockArr[laptop.id] = laptop.stock;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptopEl.appendChild(laptopElement);
}

const handleMenuChange = e => {
    removeChildElements();
    const selectedLaptop = laptopsArr[e.target.selectedIndex];
    laptopPrice.innerText = formatBalance(selectedLaptop.price);
    currentLaptopPrice = selectedLaptop.price;
    for(i = 0; i< selectedLaptop.specs.length; i++) {
        const featureItem = document.createElement("li");
        featureItem.innerText = `${selectedLaptop.specs[i]}`;
        featuresEL.appendChild(featureItem);
    }
    currentLaptopId = selectedLaptop.id;
    stockEl.innerText = stockArr[selectedLaptop.id];
    imageEl.src = `${imageURL}${selectedLaptop.image}`;
}

//Function to clear list of features
function removeChildElements() {
    let child = featuresEL.lastChild;
    while(child) {
        featuresEL.removeChild(child);
        child = featuresEL.lastChild;
    }
}

const payLaptop = () => {
    if(currentLaptopPrice <= balance && stockArr[currentLaptopId] > 0) {
        balance -= currentLaptopPrice;
        stockArr[currentLaptopId] -= 1;
        let formattedBalance = formatBalance(balance);
        balanceLabel.innerText = formattedBalance;
        stockEl.innerText = stockArr[currentLaptopId];
        alert("Congratulations! Your are now an owner of a laptop!");
    } else if (parseInt(currentLaptopPrice) >= balance) {
        alert("You need to get some more money if you want this laptop.");
    } else if (stockArr[currentLaptopId] <= 0) {
        alert("Sorry! No more laptops left of this kind.");
    } else {
        alert("Error! Try again");
    }
}

laptopEl.addEventListener("change", handleMenuChange);
payButton.addEventListener('click', payLaptop)
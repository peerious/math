const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");
const playAgain = document.getElementById("playAgain");

const gameArea = document.getElementById("gameArea");
const resultArea = document.getElementById("resultArea");

const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const accuracyEl = document.getElementById("accuracy");

const correctEl = document.getElementById("correct");
const wrongEl = document.getElementById("wrong");
const totalEl = document.getElementById("total");

const finalScoreEl = document.getElementById("finalScore");
const finalCorrectEl = document.getElementById("finalCorrect");
const finalWrongEl = document.getElementById("finalWrong");
const finalAccuracyEl = document.getElementById("finalAccuracy");

const leaderboardList = document.getElementById("leaderboardList");

const gameTimeSelect =
document.getElementById("gameTime");

const correctSound =
new Audio("sounds/correct.wav");

const wrongSound =
new Audio("sounds/wrong.wav");

correctSound.volume = 0.4;
wrongSound.volume = 0.4;

correctSound.load();
wrongSound.load();


let score = 0;
let correct = 0;
let wrong = 0;
let total = 0;

let currentAnswer = 0;

let timeLeft = parseInt(gameTimeSelect.value);
let timer;

function randomInt(min,max){
return Math.floor(Math.random()*(max-min+1))+min;
}

function getDifficulty(){
const selected =
document.querySelector(
    'input[name="difficulty"]:checked'
).value;

if(selected === "1"){
    return [1,9];
}

if(selected === "2"){
    return [10,99];
}

if(Math.random() < 0.5){
    return [1,9];
}

return [10,99];

}

function getOperations(){

const checked =
document.querySelectorAll(".op:checked");

let ops = [];

checked.forEach(box=>{
    ops.push(box.value);
});

return ops;

}

function generateQuestion(){

const ops = getOperations();

if(ops.length === 0){
    alert("Select at least one operation.");
    return;
}

const op =
ops[randomInt(0,ops.length-1)];

const range =
getDifficulty();

let a =
randomInt(range[0],range[1]);

let b =
randomInt(range[0],range[1]);

switch(op){

    case "+":
        currentAnswer = a + b;
        questionEl.textContent =
            `${a} + ${b} = ?`;
        break;

    case "-":

        if(a < b){
            [a,b] = [b,a];
        }

        currentAnswer = a - b;

        questionEl.textContent =
            `${a} - ${b} = ?`;

        break;

    case "*":

        currentAnswer = a * b;

        questionEl.textContent =
            `${a} × ${b} = ?`;

        break;

    case "/":

        currentAnswer = a;

        let divisor = b;

        let dividend =
            a * divisor;

        questionEl.textContent =
            `${dividend} ÷ ${divisor} = ?`;

        break;
}

answerEl.value = "";
answerEl.focus();

}

function updateStats(){
scoreEl.textContent = score;

correctEl.textContent = correct;
wrongEl.textContent = wrong;
totalEl.textContent = total;

let accuracy = 100;

if(total > 0){
    accuracy =
    (correct/total)*100;
}

accuracyEl.textContent =
accuracy.toFixed(1) + "%";


}

function startGame(){
clearInterval(timer);
score = 0;
correct = 0;
wrong = 0;
total = 0;

timeLeft = parseInt(gameTimeSelect.value);

document
.querySelector(".setup-panel")
.classList.add("hidden");

resultArea.classList.add("hidden");

gameArea.classList.remove("hidden");

updateStats();

timeEl.textContent = timeLeft;

generateQuestion();

timer =
setInterval(()=>{

    timeLeft--;

    timeEl.textContent =
    timeLeft;

    if(timeLeft <= 0){

        clearInterval(timer);

        endGame();
    }

},1000);


}
function checkAnswer(){
const userAnswer =
Number(answerEl.value);

if(answerEl.value === ""){
    return;
}

total++;

if(userAnswer === currentAnswer){

    score += 10;
    correct++;

    correctSound.currentTime = 0;
    correctSound.play();

}else{

    score -= 5;
    wrong++;

    wrongSound.currentTime = 0;
    wrongSound.play();
}

updateStats();

generateQuestion();

}

function saveScore(finalScore){
let scores =
JSON.parse(
    localStorage.getItem("mathLeaderboard")
) || [];

scores.push(finalScore);

scores.sort((a,b)=>b-a);

scores = scores.slice(0,10);

localStorage.setItem(
    "mathLeaderboard",
    JSON.stringify(scores)
);

}

function loadLeaderboard(){
let scores =
JSON.parse(
    localStorage.getItem("mathLeaderboard")
) || [];

leaderboardList.innerHTML = "";

if(scores.length === 0){

    const li =
    document.createElement("li");

    li.textContent =
    "No scores yet";

    leaderboardList.appendChild(li);

    return;
}

scores.forEach(score=>{

    const li =
    document.createElement("li");

    li.textContent =
    score;

    leaderboardList.appendChild(li);

});

}

function endGame(){
gameArea.classList.add("hidden");

resultArea.classList.remove("hidden");

let accuracy = 0;

if(total > 0){

    accuracy =
    (correct/total)*100;
}

const speedBonus =
Math.round(total * 2);

const accuracyBonus =
Math.round(accuracy);

const finalScore =
score +
speedBonus +
accuracyBonus;

finalScoreEl.textContent =
finalScore;

finalCorrectEl.textContent =
correct;

finalWrongEl.textContent =
wrong;

finalAccuracyEl.textContent =
accuracy.toFixed(1) + "%";

saveScore(finalScore);

loadLeaderboard();

}

submitBtn.addEventListener(
"click",
checkAnswer
);

answerEl.addEventListener(
"keydown",
function(e){
    if(e.key === "Enter"){

        checkAnswer();
    }
}

);

startBtn.addEventListener(
"click",
startGame
);

playAgain.addEventListener(
"click",
()=>{
    document
    .querySelector(".setup-panel")
    .classList.remove("hidden");

    resultArea.classList.add("hidden");
}

);

loadLeaderboard();


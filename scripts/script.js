// Difficulty settings
const difficulties = {
  easy: { pairs: 8, timeLimit: 180 },
  medium: { pairs: 8, timeLimit: 120 },
  hard: { pairs: 8, timeLimit: 90 },
};

let currentDifficulty = "medium";
let playerName = "";
let matched = 0;
let flippedCount = 0;
let cardOne, cardTwo;
let disableDeck = false;
let timer;
let time = 0;
let attempts = 0;

// DOM elements
const cards = document.querySelectorAll(".card");
const timerElement = document.getElementById("timer");
const messageElement = document.getElementById("message");
const startButton = document.getElementById("start-button");
const nameInput = document.getElementById("name-input");
const difficultySelect = document.getElementById("difficulty-select");
const mainMenu = document.querySelector(".mc-game-menu");
const mainGame = document.querySelector(".wrapper");
const scoreList = document.getElementById("score-list");
const attemptsElement = document.getElementById("attempts");
const restartButton = document.getElementById("restart-button");

// Start timer
function startTimer(timeLimit) {
  clearInterval(timer);
  time = timeLimit;
  messageElement.style.display = "none";
  timerElement.textContent = `Time: ${time}s`;
  timer = setInterval(() => {
    time--;
    timerElement.textContent = `Time: ${time}s`;
    if (time <= 0) {
      clearInterval(timer);
      disableDeck = true;
      endGame(false);
    }
  }, 1000);
}

// Stop timer
function stopTimer() {
  clearInterval(timer);
}

function flipCard({ target: clickedCard }) {
  if (cardOne !== clickedCard && !disableDeck) {
    flippedCount++;
    clickedCard.classList.add("flip");

    if (!cardOne) {
      return (cardOne = clickedCard);
    }

    cardTwo = clickedCard;
    disableDeck = true;

    // Update attempts
    attempts++;
    attemptsElement.textContent = `Attempts: ${attempts}`;

    let cardOneImg = cardOne.querySelector(".back-view img").src,
      cardTwoImg = cardTwo.querySelector(".back-view img").src;

    matchCards(cardOneImg, cardTwoImg);
  }
}

function matchCards(img1, img2) {
  if (img1 === img2) {
    const correctSound = document.getElementById("correct-sound");
    if (correctSound) {
      correctSound.currentTime = 0;
      correctSound.play();
    }
    matched++;

 // Add sparkle effect to both matched cards
 [cardOne, cardTwo].forEach(card => {
  const sparkle = document.createElement("div");
  sparkle.classList.add("sparkle");
  card.appendChild(sparkle);
  
  // Remove sparkle after animation ends
  setTimeout(() => {
    sparkle.remove();
  }, 1000);
});
    
    if (matched === difficulties[currentDifficulty].pairs) {
      stopTimer();
      endGame(true);
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    return (disableDeck = false);
  }

  const wrongSound = document.getElementById("wrong-sound");
  if (wrongSound) {
    wrongSound.currentTime = 0;
    wrongSound.play();
  }

  setTimeout(() => {
    cardOne.classList.add("shake");
    cardTwo.classList.add("shake");
  }, 200);

  setTimeout(() => {
    cardOne.classList.remove("shake", "flip");
    cardTwo.classList.remove("shake", "flip");
    cardOne = cardTwo = "";
    disableDeck = false;
  }, 1200);
}
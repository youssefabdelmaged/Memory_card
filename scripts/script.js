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
    [cardOne, cardTwo].forEach((card) => {
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

// Shuffle cards
function shuffleCard(difficulty) {
  if (!difficulty) difficulty = currentDifficulty;
  currentDifficulty = difficulty;
  matched = 0;
  flippedCount = 0;
  attempts = 0; // ✅ Reset attempts
  attemptsElement.textContent = `Attempts: 0`; // ✅ Update UI
  disableDeck = false;
  cardOne = cardTwo = "";
  messageElement.style.display = "none";

  const pairs = difficulties[difficulty].pairs;
  const totalCards = pairs * 2;

  let arr = [];
  for (let i = 1; i <= pairs; i++) {
    arr.push(i, i);
  }

  function easyShuffle(array) {
    for (let i = 0; i < array.length / 2; i++) {
      const j = i + Math.floor(Math.random() * (array.length / 2));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function mediumShuffle(array) {
    const size = 4;
    let grid = new Array(size).fill(null).map(() => new Array(size).fill(null));
    let pairNum = 1;
    for (let i = 0; i < size / 2; i++) {
      for (let j = 0; j < size; j++) {
        if (pairNum > array.length / 2) break;
        grid[i][j] = pairNum;
        grid[size - 1 - i][size - 1 - j] = pairNum;
        pairNum++;
      }
    }
    let idx = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        array[idx++] = grid[r][c];
      }
    }
  }

  function preHardShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function hardShuffle(array) {
    preHardShuffle(array);
    preHardShuffle(array);
  }

  if (difficulty === "easy") {
    easyShuffle(arr);
  } else if (difficulty === "medium") {
    mediumShuffle(arr);
  } else if (difficulty === "hard") {
    hardShuffle(arr);
  }

  cards.forEach((card, i) => {
    if (i < totalCards) {
      card.style.display = "flex";
      card.classList.remove("flip");
      let imgTag = card.querySelector(".back-view img");
      imgTag.src = `images/img-${arr[i]}.png`;
      card.addEventListener("click", flipCard);
    } else {
      card.style.display = "none";
      card.removeEventListener("click", flipCard);
    }
  });

  startTimer(difficulties[difficulty].timeLimit);
}

function endGame(won) {
  stopTimer();
  disableDeck = true;
  const score = matched;

  messageElement.style.opacity = 0;
  messageElement.style.maxHeight = "10px";
  messageElement.style.maxWidth = "390px";
  messageElement.style.overflow = "hidden";
  messageElement.style.display = "flex";
  messageElement.style.whiteSpace = "normal";
  messageElement.style.transition = "opacity 1.5s ease, max-height 1.5s ease";

  messageElement.textContent = won
    ? `You win! Congratulations, ${playerName}`
    : `You lose! Time's up, ${playerName}.`;

  setTimeout(() => {
    messageElement.style.opacity = 1;
    messageElement.style.maxHeight = "300px";
  }, 50);

  saveScore(playerName, score, won);

  nameInput.value = "";
  difficultySelect.value = "easy";

  setTimeout(() => {
    messageElement.style.opacity = 0;
    messageElement.style.maxHeight = "0px";
    setTimeout(() => {
      mainMenu.style.display = "flex";
      mainGame.style.display = "none";
      messageElement.style.display = "none";
      updateLeaderboard();
    }, 1500);
  }, 3000);
}

mainGame.style.display = "none";

startButton.addEventListener("click", () => {
  playerName = nameInput.value.trim();
  const selectedDifficulty = difficultySelect.value;

  if (!playerName) {
    alert("Please enter your name.");
    return;
  }

  if (!selectedDifficulty) {
    alert("Please select a difficulty.");
    return;
  }

  mainMenu.style.display = "none";
  mainGame.style.display = "block";

  shuffleCard(selectedDifficulty);
});

restartButton.addEventListener("click", () => {
  shuffleCard(currentDifficulty);
});

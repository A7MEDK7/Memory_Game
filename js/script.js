"use strict";

// Game Variable
const startGame = document.querySelector(".start-game button");
let movesScore = document.querySelector(".footer .moves p");
let gameTime = document.querySelector(".footer .time p");
let allLogos = document.querySelectorAll('.container .box i');
let allBoxes = document.querySelectorAll('.box');
let startNewGame = false;
let youCanFlip = true;
let matchedCards = 0;

// Handle Game Time
let time = 0;
let timerInterval;

function startTimer() {
    timerInterval = setInterval(() => {
    time++;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    gameTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Handle Start Game Button
startGame.addEventListener("click", function() {
    // Clear Old Timer
    clearInterval(timerInterval);
    // Select All Cards
    let allBoxes = document.querySelectorAll('.box');
    // Restart All Cards Setting
    allBoxes.forEach(box => box.classList.remove('locked'));

    movesScore.textContent = 0;
    gameTime.textContent = `0:00`;
    time = 0;
    matchedCards = 0;

    // Make Random Cards
    let container = document.querySelector('.container');
    let boxesArray = Array.from(allBoxes);
    let shuffledArray = boxesArray.sort(() => Math.random() - 0.5);

    // Clear old boxes
    container.innerHTML = "";

    // Append shuffled boxes
    shuffledArray.forEach(box => container.appendChild(box));

    // Start New Timer
    startTimer();

    allBoxes.forEach(box => box.classList.add('flipped'));

    setTimeout(() => { 
        allLogos.forEach(logo => {
            logo.style.visibility = 'visible';
        });
    }, 150);

    setTimeout(() => {
        allLogos.forEach(logo => {
            logo.style.visibility = 'hidden';
        });
        allBoxes.forEach(box => box.classList.remove('flipped'));
    }, 2000);

    startNewGame = true;
});

// Handle Flip Cards
let flippedCards = [];
let lockBoard = false;

allBoxes.forEach(box => {
    box.addEventListener('click', () => flipCard(box));
});

function flipCard(card) {
    if (!youCanFlip) return;
    if (!startNewGame) return;
    if (lockBoard) return;
    if (flippedCards.includes(card)) return;
    if (card.classList.contains('locked')) return;

    card.classList.add('flipped');
    card.querySelector('i').style.visibility = 'visible';
    
    flippedCards.push(card);
    movesScore.textContent++;

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// Handle Check Match Cards
function checkMatch() {
    youCanFlip = false;
    let [card1, card2] = flippedCards;
    let logo1 = card1.querySelector('i').dataset.logo;
    let logo2 = card2.querySelector('i').dataset.logo;

    if (logo1 === logo2) {
        setTimeout( () => {
            card1.classList.add('locked');
            card2.classList.add('locked');
            matchedCards += 2;
            // Check Won Game
            if (matchedCards === 16) gameWon(); 
        }, 500)
        // Continue
        flippedCards = [];
    } else {
    lockBoard = true;

    setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.querySelector('i').style.visibility = 'hidden';
        card2.querySelector('i').style.visibility = 'hidden';
        flippedCards = [];
        lockBoard = false;
        }, 1000);
    }
    youCanFlip = true;
}

// Handle Game Won
function gameWon() {
    stopTimer(); 
    startNewGame = false; 
    // Show Game Result
    document.getElementById('finalMoves').textContent = `Moves: ${movesScore.textContent}`;
    document.getElementById('finalTime').textContent = `Time: ${gameTime.textContent}`;
    // Show PopUp
    document.getElementById('winPopup').classList.add('show');
}

function closePopup() {
    document.getElementById('winPopup').classList.remove('show');
}

let guessedLetters = [];
let incorrectGuesses = [];
let remainingAttempts = 6;
let selectedWord = "";

const wordDisplay = document.getElementById("wordDisplay");
const letterInput = document.getElementById("letterInput");
const guessButton = document.getElementById("guessButton");
const incorrectGuessesElement = document.getElementById("incorrectGuesses");
const remainingAttemptsElement = document.getElementById("remainingAttempts");
const messageElement = document.getElementById("message");

const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");

function initializeGame() {
    fetch('/initialize', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        selectedWord = data.word;
        guessedLetters = [];
        incorrectGuesses = [];
        remainingAttempts = data.remaining_attempts;
        updateDisplay();
        drawInitialHangmanPole();
    })
    .catch(error => console.error('Error initializing game:', error));
}

function handleGuess() {
    const guess = letterInput.value.toLowerCase();

    if (
        guess.match(/[a-z]/i) &&
        guess.length === 1 &&
        !guessedLetters.includes(guess) &&
        !incorrectGuesses.includes(guess)) {
        fetch('/guess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                letter: guess,
                word: selectedWord
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                remainingAttempts = data.remaining_attempts;
                if (selectedWord.includes(guess)) {
                    guessedLetters.push(guess);
                } else {
                    incorrectGuesses.push(guess);
                    drawHangman();
                }
                updateDisplay();
                checkGameStatus();
            } else {
                console.error('Error in response:', data);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    letterInput.value = "";  
}

function updateDisplay() {
    const displayWord = selectedWord.split("").map(letter => (guessedLetters.includes(letter) ? letter : "_")).join(" ");
    wordDisplay.textContent = displayWord;
    incorrectGuessesElement.textContent = `Incorrect guesses: ${incorrectGuesses.join(", ")}`;
    remainingAttemptsElement.textContent = `Remaining attempts: ${remainingAttempts}`;
}

function endGame(message, isSuccess) {
    letterInput.disabled = true;
    guessButton.disabled = true;
    messageElement.textContent = message;
    messageElement.style.color = isSuccess ? 'green' : 'red';  
}

function checkGameStatus() {
    if (remainingAttempts <= 0) {
        endGame("You lose! The word was " + selectedWord, false); 
    } else if (selectedWord.split("").every(letter => guessedLetters.includes(letter))) {
        endGame("Congratulations, you won!", true);  
    }
}

function drawHangman() {
    switch (incorrectGuesses.length) {
        case 1: drawHead(); break;
        case 2: drawBody(); break;
        case 3: drawLeftArm(); break;
        case 4: drawRightArm(); break;
        case 5: drawLeftLeg(); break;
        case 6: drawRightLeg(); break;
        default: break;
    }
}

function drawInitialHangmanPole() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(10, 190);
    ctx.lineTo(190, 190);
    ctx.stroke();
    // Pole
    ctx.beginPath();
    ctx.moveTo(30, 190);
    ctx.lineTo(30, 20);
    ctx.stroke();
    // Top bar
    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.lineTo(120, 20);
    ctx.stroke();
    // Rope
    ctx.beginPath();
    ctx.moveTo(120, 20);
    ctx.lineTo(120, 50);
    ctx.stroke();
}

function drawHead() {
    ctx.beginPath();
    ctx.arc(120, 60, 10, 0, Math.PI * 2, true); 
    ctx.stroke();
}

function drawBody() {
    ctx.beginPath();
    ctx.moveTo(120, 70);
    ctx.lineTo(120, 110);
    ctx.stroke();
}

function drawLeftArm() {
    ctx.beginPath();
    ctx.moveTo(120, 80);
    ctx.lineTo(100, 100); 
    ctx.stroke();
}

function drawRightArm() {
    ctx.beginPath();
    ctx.moveTo(120, 80);
    ctx.lineTo(140, 100); 
    ctx.stroke();
}

function drawLeftLeg() {
    ctx.beginPath();
    ctx.moveTo(120, 110);
    ctx.lineTo(100, 140); 
    ctx.stroke();
}

function drawRightLeg() {
    ctx.beginPath();
    ctx.moveTo(120, 110);
    ctx.lineTo(140, 140); 
    ctx.stroke();
}

initializeGame();
guessButton.addEventListener("click", handleGuess);

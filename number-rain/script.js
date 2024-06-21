// Function to generate a random number between a min and max value
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initial game settings (can be adjusted)
const gameArea = document.getElementById("game-area");
const minNumber = 1;
const maxNumber = 100;
const fontSize = 32; // Adjust font size as desired

// Game variables
let currentNumber = getRandomNumber(minNumber, maxNumber); // Start with a random number
let isGameStarted = false; // Flag to track game state
let gameIntervals = []; // To keep track of all intervals for cleanup
let clickHandlers = []; // To keep track of click event listeners

// Function to display the number on the screen
function displayNumber() {
    if (!isGameStarted) return; // Don't display numbers if game not started

    // Ensure gameWidth and gameHeight are correctly initialized
    const gameWidth = gameArea.offsetWidth;
    const gameHeight = gameArea.offsetHeight;

    const numberElement = document.createElement("div");
    numberElement.textContent = currentNumber;
    numberElement.style.position = "absolute";
    numberElement.style.fontSize = fontSize + "px";
    numberElement.style.color = "#333";
    numberElement.style.left = Math.random() * (gameWidth - fontSize) + "px"; // Random horizontal position
    numberElement.style.top = -fontSize + "px"; // Start the number above the screen

    gameArea.appendChild(numberElement);

    // Animate the number falling down
    const numberInterval = setInterval(() => {
        const currentTop = numberElement.offsetTop;
        numberElement.style.top = currentTop + 3 + "px"; // Adjust speed as desired (decreased to 3 pixels per interval)

        // Check if the number has fallen out of the game area (game over)
        if (currentTop > gameHeight) {
            clearInterval(numberInterval);
            removeNumber(numberElement, numberInterval); // Remove number and cleanup
        }
    }, 20); // Adjust interval for speed of falling numbers (increased to 20 milliseconds)

    gameIntervals.push(numberInterval); // Keep track of this interval

    // Click event handler for the number element
    const clickHandler = () => {
        if (currentNumber === parseInt(numberElement.textContent)) { // Check correct number
            // Correct click (number matches currentNumber)
            gameArea.removeChild(numberElement);
            currentNumber = getRandomNumber(minNumber, maxNumber); // Generate a new number
            displayNumber(); // Display the new number
        } else {
            // Incorrect click (not matching currentNumber)
            clearInterval(numberInterval);
            removeNumber(numberElement, numberInterval); // Remove number and cleanup
        }
    };

    numberElement.addEventListener("click", clickHandler);
    clickHandlers.push({ element: numberElement, handler: clickHandler }); // Store reference to handler

}

const startGameButton = document.getElementById("startGameButton");
const restartButton = document.getElementById("restartButton");

startGameButton.addEventListener("click", () => {
    isGameStarted = true;
    currentNumber = getRandomNumber(minNumber, maxNumber);
    displayNumber();
});

restartButton.addEventListener("click", () => {
    // Reset game state for restart
    isGameStarted = false;
    currentNumber = getRandomNumber(minNumber, maxNumber);
    gameArea.innerHTML = ""; // Clear existing numbers from the game area
    document.getElementById("gameOverContainer").style.display = "none"; // Hide Game Over message

    // Clear all intervals and event listeners
    gameIntervals.forEach(interval => clearInterval(interval));
    gameIntervals = [];

    clickHandlers.forEach(({ element, handler }) => {
        element.removeEventListener("click", handler); // Remove event listener
    });
    clickHandlers = [];

    isGameStarted = true; // Restart the game
    displayNumber(); // Start a new game
});

function removeNumber(numberElement, interval) {
    clearInterval(interval); // Clear interval
    gameArea.removeChild(numberElement); // Remove number from DOM

    // Remove event listener
    const handlerToRemove = clickHandlers.find(({ element }) => element === numberElement);
    if (handlerToRemove) {
        numberElement.removeEventListener("click", handlerToRemove.handler);
        clickHandlers = clickHandlers.filter(({ element }) => element !== numberElement);
    }

    // Check if game over
    if (gameArea.children.length === 0 && isGameStarted) {
        gameOver();
    }
}

function gameOver() {
    isGameStarted = false; // End the game
    alert("Game Over! Numbers must be clicked inside Box.");
    document.getElementById("gameOverContainer").style.display = "block"; // Show Game Over message
}

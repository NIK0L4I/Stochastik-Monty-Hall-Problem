// script.js

// Global variables to store game state
let carDoor;
let playerChoice;
let revealedDoor;
let gameInProgress = true;

// Utility to get a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize a new game
function initGame() {
  gameInProgress = true;
  playerChoice = null;
  revealedDoor = null;
  // Randomly choose which door hides the car (1, 2, or 3)
  carDoor = getRandomInt(1, 3);
  // Reset door images to closed
  document.querySelectorAll('.door img').forEach(img => {
    img.src = 'assets/door-closed.png';
  });
  document.getElementById('result').textContent = "";
  document.getElementById('decisionButtons').style.display = "none";
  document.getElementById('resetBtn').disabled = true;
}

initGame();

// Add event listeners to the doors
document.querySelectorAll('.door').forEach(door => {
  door.addEventListener('click', () => {
    if (!gameInProgress) return;
    
    const doorNumber = parseInt(door.getAttribute('data-door'));
    // If player already chose a door, ignore additional clicks.
    if (playerChoice !== null) return;
    
    playerChoice = doorNumber;
    // Host reveals a door that is neither the player's choice nor the car door.
    revealGoatDoor();
    // Now show decision buttons to stay or switch.
    document.getElementById('decisionButtons').style.display = "block";
  });
});

// Reveal a goat door based on the player's choice
function revealGoatDoor() {
  // Get list of possible doors to reveal
  let options = [1, 2, 3].filter(num => num !== playerChoice && num !== carDoor);
  // If player's choice was the car, the host can randomly pick one of the two goat doors.
  revealedDoor = options[getRandomInt(0, options.length - 1)];
  // Change the door image to show a goat
  document.querySelector(`[data-door="${revealedDoor}"] img`).src = 'assets/door-open-goat.png';
}

// Process the decision to stay or switch
function completeGame(decision) {
  gameInProgress = false;
  let finalChoice = playerChoice;
  if (decision === 'switch') {
    // The only remaining door that wasn't chosen initially or revealed by host.
    finalChoice = [1, 2, 3].find(num => num !== playerChoice && num !== revealedDoor);
  }
  // Reveal the outcome for all doors
  [1,2,3].forEach(num => {
    const doorElement = document.querySelector(`[data-door="${num}"]`);
    if (num === carDoor) {
      doorElement.querySelector('img').src = 'assets/door-open-car.png';
    } else if (num !== revealedDoor) {
      // If not already revealed and not the car, show goat
      doorElement.querySelector('img').src = 'assets/door-open-goat.png';
    }
  });
  
  // Display result message
  const resultText = (finalChoice === carDoor) ? "Congratulations! You won the car!" : "Sorry, you got a goat.";
  document.getElementById('result').textContent = resultText;
  
  // Enable the reset button
  document.getElementById('resetBtn').disabled = false;
}

// Attach event listeners to decision buttons
document.getElementById('stayBtn').addEventListener('click', () => {
  completeGame('stay');
  document.getElementById('decisionButtons').style.display = "none";
});
document.getElementById('switchBtn').addEventListener('click', () => {
  completeGame('switch');
  document.getElementById('decisionButtons').style.display = "none";
});

// Reset the game when the "New Game" button is clicked
document.getElementById('resetBtn').addEventListener('click', initGame);

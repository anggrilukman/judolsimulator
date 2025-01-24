const rows = 5; // Rows of the board
const cols = 6; // Columns of the board
const gems = ['red', 'blue', 'green', 'yellow', 'purple'];
let board = [];
let score = 0;
let money = 50;
let betAmount = 5;
let totalSpins = 0;
let wins = 0;
let winRate = 0; // Default win rate (0%)

// Initialize the game board
function createBoard() {
    board = Array.from({ length: rows }, () => Array(cols).fill(null));
    renderBoard();
    fillBoard();
}

// Generate a random gem, influenced by win rate
function getRandomGem(row, col) {
    const random = Math.random() * 100;

    // If within win rate, attempt to create a deliberate match
    if (random < winRate) {
        // Horizontal match
        if (col >= 2 && board[row][col - 1] === board[row][col - 2]) {
            return board[row][col - 1];
        }
        // Vertical match
        if (row >= 2 && board[row - 1][col] === board[row - 2][col]) {
            return board[row - 1][col];
        }
    }

    // Otherwise, return a random gem that avoids matches
    let randomGem;
    do {
        randomGem = gems[Math.floor(Math.random() * gems.length)];
    } while (
        (col >= 2 && randomGem === board[row][col - 1] && randomGem === board[row][col - 2]) ||
        (row >= 2 && randomGem === board[row - 1][col] && randomGem === board[row - 2][col])
    );

    return randomGem;
}

// Fill the board with gems
function fillBoard() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!board[row][col]) board[row][col] = getRandomGem(row, col);
        }
    }
    renderBoard();
}

// Render the game board
function renderBoard() {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = '';

    board.forEach((row, rowIndex) => {
        row.forEach((gem, colIndex) => {
            const gemDiv = document.createElement('div');
            gemDiv.className = `gem ${gem || 'empty'}`;

            if (gem) {
                const img = document.createElement('img');
                img.src = `images/${gem}.png`; // Assumes images exist for each gem
                gemDiv.appendChild(img);
            }

            boardDiv.appendChild(gemDiv);
        });
    });

    // Update score and money display
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('money').textContent = `Money: $${money}`;
    document.getElementById('bet').textContent = `Bet: $${betAmount}`;
}

// Find matches (3 or more in a row or column)
function findMatches() {
    const matches = [];

    // Check rows
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols - 2; col++) {
            if (board[row][col] && board[row][col] === board[row][col + 1] && board[row][col] === board[row][col + 2]) {
                matches.push([row, col], [row, col + 1], [row, col + 2]);
            }
        }
    }

    // Check columns
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows - 2; row++) {
            if (board[row][col] && board[row][col] === board[row + 1][col] && board[row][col] === board[row + 2][col]) {
                matches.push([row, col], [row + 1, col], [row + 2, col]);
            }
        }
    }

    return [...new Set(matches.map(JSON.stringify))].map(JSON.parse);
}

// Calculate prize
function calculatePrize(matches) {
    return matches.length * 10; // $10 per match
}

// Spin the slot machine
function spinSlotMachine() {
    if (money < betAmount) {
        alert('Not enough money to spin!');
        return;
    }

    money -= betAmount;
    totalSpins++;

    board = Array.from({ length: rows }, () => Array(cols).fill(null));
    fillBoard();
    const matches = findMatches();

    if (matches.length) {
        wins++;
        const prize = calculatePrize(matches);
        money += prize;
        score += prize;

        alert(`You won $${prize}!`);

        // Bersihkan papan setelah 3 detik
        setTimeout(() => {
            board = Array.from({ length: rows }, () => Array(cols).fill(null));
            renderBoard();
        }, 3000);
    } else {
        // Bersihkan papan jika tidak ada kecocokan setelah 3 detik
        setTimeout(() => {
            board = Array.from({ length: rows }, () => Array(cols).fill(null));
            renderBoard();
        }, 3000);
    }

    renderBoard();
}


// Adjust win rate from slider
document.getElementById('winRateSlider').addEventListener('input', (e) => {
    winRate = parseInt(e.target.value, 10);
});

// Deposit money
function depositMoney(amount) {
    if (amount > 0) {
        money += amount;
        renderBoard();
    } else {
        alert('Deposit amount must be greater than 0.');
    }
}

// Bet control buttons
document.getElementById('increaseBetButton').addEventListener('click', () => {
    betAmount += 5; // Increase bet by $5
    renderBoard();
});

document.getElementById('decreaseBetButton').addEventListener('click', () => {
    if (betAmount > 5) {
        betAmount -= 5; // Decrease bet by $5
        renderBoard();
    }
});

// Spin button
document.getElementById('spinButton').addEventListener('click', spinSlotMachine);

// Deposit button
document.getElementById('depositButton').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    depositMoney(amount);
});

// Initialize the game
document.addEventListener('DOMContentLoaded', createBoard);
// Adjust win rate from slider
const winRateSlider = document.getElementById('winRateSlider');
const winRateValue = document.getElementById('winRateValue');

winRateSlider.addEventListener('input', (e) => {
    winRate = parseInt(e.target.value, 10);
    winRateValue.textContent = `${winRate}%`;
});



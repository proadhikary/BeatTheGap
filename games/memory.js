const gameGrid = document.getElementById('game-grid');
const movesDisplay = document.getElementById('moves-count');
const pairsDisplay = document.getElementById('pairs-count');
const winModal = document.getElementById('win-modal');
const finalMovesDisplay = document.getElementById('final-moves');

// Game Data: Pairs of (Name + Icon)
const cardsData = [
    { id: 1, name: "Gagandeep Kang", icon: "fa-microscope", type: "person" },
    { id: 1, name: "Royal Society", icon: "fa-medal", type: "field" },

    // { id: 2, name: "Indira Hinduja", icon: "fa-baby", type: "person" },
    // { id: 2, name: "Test-tube Baby", icon: "fa-flask-vial", type: "field" },

    // { id: 3, name: "Asima Chatterjee", icon: "fa-leaf", type: "person" },
    // { id: 3, name: "Medicinal Chemistry", icon: "fa-flask", type: "field" },

    // { id: 4, name: "Anna Mani", icon: "fa-cloud", type: "person" },
    // { id: 4, name: "Meteorology", icon: "fa-wind", type: "field" },

    // { id: 5, name: "Sunetra Gupta", icon: "fa-chart-line", type: "person" },
    // { id: 5, name: "Epidemiology", icon: "fa-virus", type: "field" },

    // { id: 6, name: "Nandini Harinath", icon: "fa-rocket", type: "person" },
    // { id: 6, name: "Mars Mission", icon: "fa-planet-ringed", type: "field" }
];

let cards = []; // Shuffled cards
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function initGame() {
    cards = shuffle([...cardsData]); // Copy and shuffle
    gameGrid.innerHTML = '';
    matchedPairs = 0;
    moves = 0;
    movesDisplay.textContent = moves;
    pairsDisplay.textContent = '0';
    winModal.classList.add('hidden');
    lockBoard = false;
    flippedCards = [];

    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card h-24 sm:h-32 w-full relative';
        cardElement.dataset.id = card.id;
        cardElement.dataset.index = index;

        cardElement.innerHTML = `
            <div class="memory-card-inner absolute w-full h-full text-center transition-all duration-500">
                <div class="memory-card-front absolute w-full h-full bg-green-500 rounded-xl flex items-center justify-center text-white text-3xl shadow-md border-2 border-green-600">
                    <i class="fa-solid fa-question"></i>
                </div>
                <div class="memory-card-back absolute w-full h-full bg-white rounded-xl flex flex-col items-center justify-center shadow-md border-2 border-green-500 p-2">
                    <i class="fa-solid ${card.icon} text-2xl sm:text-3xl text-green-600 mb-1 sm:mb-2"></i>
                    <span class="text-xs sm:text-sm font-bold text-gray-700 leading-tight">${card.name}</span>
                </div>
            </div>
        `;

        cardElement.addEventListener('click', flipCard);
        gameGrid.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === flippedCards[0]) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        checkForMatch();
    }
}

function checkForMatch() {
    lockBoard = true;
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.id === card2.dataset.id;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    matchedPairs++;
    pairsDisplay.textContent = matchedPairs;
    flippedCards = [];
    lockBoard = false;

    // Visual feedback for match
    setTimeout(() => {
        // Optional: Add sparkle or pulse animation
    }, 500);

    if (matchedPairs === cardsData.length / 2) {
        setTimeout(showWin, 800);
    }
}

function unflipCards() {
    setTimeout(() => {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        flippedCards = [];
        lockBoard = false;
    }, 1000);
}

function showWin() {
    finalMovesDisplay.textContent = moves;
    winModal.classList.remove('hidden');

    // Simple confetti effect (reuse if available from quiz, or minimal implementation)
    // Assuming confetti is available globally or we skip it for simplicity in this file
}

function restartGame() {
    initGame();
}

// Start game on load
initGame();

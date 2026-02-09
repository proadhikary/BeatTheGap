const gameGrid = document.getElementById('game-grid');
const movesDisplay = document.getElementById('moves-count');
const pairsDisplay = document.getElementById('pairs-count');
const winModal = document.getElementById('win-modal');
const finalMovesDisplay = document.getElementById('final-moves');

// Game Data: Pairs of (Name + Icon)
const cardsData = [
    { id: 1, name: "Kalpana Chawla", icon: "fa-shuttle-space", type: "person" },
    { id: 1, name: "Aerospace", icon: "fa-plane-departure", type: "field" },

    { id: 2, name: "Tessy Thomas", icon: "fa-rocket", type: "person" },
    { id: 2, name: "Missile Tech", icon: "fa-fire", type: "field" },

    { id: 3, name: "Janaki Ammal", icon: "fa-leaf", type: "person" },
    { id: 3, name: "Botany", icon: "fa-seedling", type: "field" },

    { id: 4, name: "Anandibai Joshi", icon: "fa-user-doctor", type: "person" },
    { id: 4, name: "Medicine", icon: "fa-stethoscope", type: "field" },

    { id: 5, name: "Shakuntala Devi", icon: "fa-calculator", type: "person" },
    { id: 5, name: "Mathematics", icon: "fa-infinity", type: "field" },

    { id: 6, name: "Kiran Mazumdar", icon: "fa-flask-vial", type: "person" },
    { id: 6, name: "Biotech", icon: "fa-dna", type: "field" }
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

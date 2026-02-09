const gameArea = document.getElementById('game-area');
const basket = document.getElementById('basket');
const scoreDisplay = document.getElementById('score');
const missedDisplay = document.getElementById('missed');
const startOverlay = document.getElementById('start-overlay');
const gameOverOverlay = document.getElementById('game-over-overlay');
const finalScoreDisplay = document.getElementById('final-score');

let score = 0;
let missed = 0;
let gameInterval;
let spawnRate = 1500;
let fallingSpeed = 3;
let isGameActive = false;
let items = [];

// Game Items Configuration
const goodItems = [
    { text: "Grant", icon: "fa-certificate", color: "text-green-500", bg: "bg-green-100" },
    { text: "Mentor", icon: "fa-user-tie", color: "text-blue-500", bg: "bg-blue-100" },
    { text: "Degree", icon: "fa-scroll", color: "text-yellow-600", bg: "bg-yellow-100" },
    { text: "Equality", icon: "fa-scale-balanced", color: "text-purple-500", bg: "bg-purple-100" }
];

const badItems = [
    { text: "Bias", icon: "fa-ban", color: "text-red-500", bg: "bg-red-100" },
    { text: "Stereotype", icon: "fa-masks-theater", color: "text-orange-500", bg: "bg-orange-100" },
    { text: "Imposter", icon: "fa-user-secret", color: "text-gray-500", bg: "bg-gray-200" }
];

// Basket Movement
function moveBasket(x) {
    if (!isGameActive) return;
    const rect = gameArea.getBoundingClientRect();
    let newLeft = x - rect.left - basket.offsetWidth / 2;

    // Boundary checks
    if (newLeft < 0) newLeft = 0;
    if (newLeft > rect.width - basket.offsetWidth) newLeft = rect.width - basket.offsetWidth;

    basket.style.left = `${newLeft + basket.offsetWidth / 2}px`; // Centering logic fix
    // Actually left needs to be percent or pixels relative to parent
    // Let's use simpler logic: style.left is position of left edge.
    // Centering visual is handled by CSS transform translate-x-1/2.
    // So we just set left to mouse position relative to container

    let safeLeft = x - rect.left;
    if (safeLeft < 0) safeLeft = 0;
    if (safeLeft > rect.width) safeLeft = rect.width;
    basket.style.left = `${safeLeft}px`;
}

// Mouse/Touch Events
gameArea.addEventListener('mousemove', (e) => moveBasket(e.clientX));
gameArea.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Stop scrolling
    moveBasket(e.touches[0].clientX);
}, { passive: false });

function spawnItem() {
    if (!isGameActive) return;

    const isGood = Math.random() > 0.35; // 65% chance of good item
    const itemData = isGood ? goodItems[Math.floor(Math.random() * goodItems.length)] : badItems[Math.floor(Math.random() * badItems.length)];

    const item = document.createElement('div');
    item.className = `absolute h-14 w-14 rounded-full flex flex-col items-center justify-center shadow-md animate-spin-slow z-0 ${itemData.bg}`;
    item.innerHTML = `<i class="fa-solid ${itemData.icon} ${itemData.color} text-xl"></i><span class="text-[0.6rem] font-bold ${itemData.color}">${itemData.text}</span>`;

    // Random position
    const maxLeft = gameArea.offsetWidth - 60;
    const randomLeft = Math.floor(Math.random() * maxLeft);
    item.style.left = `${randomLeft}px`;
    item.style.top = '-60px';

    gameArea.appendChild(item);
    items.push({ el: item, isGood: isGood, y: -60, speed: fallingSpeed + Math.random() * 2 });
}

function updateGame() {
    if (!isGameActive) return;

    items.forEach((itemObj, index) => {
        itemObj.y += itemObj.speed;
        itemObj.el.style.top = `${itemObj.y}px`;

        const itemRect = itemObj.el.getBoundingClientRect();
        const basketRect = basket.getBoundingClientRect();

        // Collision
        if (
            itemRect.left < basketRect.right &&
            itemRect.right > basketRect.left &&
            itemRect.bottom > basketRect.top &&
            itemRect.top < basketRect.bottom
        ) {
            // Caught
            if (itemObj.isGood) {
                score += 10;
                flashFeedback('green');
                fallingSpeed += 0.1; // Increase difficulty
            } else {
                score -= 5;
                flashFeedback('red');
                // Shake effect
                gameArea.classList.add('animate-pulse');
                setTimeout(() => gameArea.classList.remove('animate-pulse'), 200);
            }
            removeitem(index);
        }
        // Missed (Fell off screen)
        else if (itemObj.y > gameArea.offsetHeight) {
            if (itemObj.isGood) {
                missed++;
                if (missed >= 5) gameOver();
            }
            removeitem(index);
        }
    });

    scoreDisplay.textContent = score;
    missedDisplay.textContent = missed;

    if (isGameActive) requestAnimationFrame(updateGame);
}

function removeitem(index) {
    if (items[index]) {
        items[index].el.remove();
        items.splice(index, 1);
    }
}

function flashFeedback(color) {
    // Optional visual trigger provided by CSS or simple logic
}

function startGame() {
    isGameActive = true;
    score = 0;
    missed = 0;
    fallingSpeed = 3;
    items.forEach(i => i.el.remove());
    items = [];

    scoreDisplay.textContent = '0';
    missedDisplay.textContent = '0';

    startOverlay.classList.add('hidden');
    gameOverOverlay.classList.add('hidden');

    gameInterval = setInterval(spawnItem, spawnRate);
    requestAnimationFrame(updateGame);
}

function gameOver() {
    isGameActive = false;
    clearInterval(gameInterval);
    finalScoreDisplay.textContent = score;
    gameOverOverlay.classList.remove('hidden');
}

// Cleanup on exit? Not strictly needed for simple DOM app but good practice

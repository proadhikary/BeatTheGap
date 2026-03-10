const container = document.getElementById('card-container');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('final-score');
const endCard = document.getElementById('end-card');

const feedbackPopup = document.getElementById('feedback-popup');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackExplanation = document.getElementById('feedback-explanation');
const btnNext = document.getElementById('btn-next');

const factsData = [
    {
        text: "The first computer programmer was a woman.",
        isFact: true,
        explanation: "Correct! Ada Lovelace is widely considered the first computer programmer."
    },
    {
        text: "Men are biologically better at math than women.",
        isFact: false,
        explanation: "Fiction! Research shows no significant biological difference in math ability between genders."
    },
    {
        text: "India has one of the highest percentages of female STEM graduates in the world.",
        isFact: true,
        explanation: "Fact! India has around 43% female STEM graduates, higher than the US or UK."
    },
    {
        text: "AI algorithms are always neutral and unbiased.",
        isFact: false,
        explanation: "Fiction! AI can inherit and amplify biases present in their training data."
    },
    {
        text: "Gargi and Maitreyi were ancient Indian women scholars.",
        isFact: true,
        explanation: "Fact! They were renowned philosophers mentioned in Vedic texts."
    },
    {
        text: "The 'Glass Ceiling' is a myth.",
        isFact: false,
        explanation: "Fiction! The barrier is real, preventing many qualified women from reaching top leadership roles."
    }
];

let cards = [];
let currentIndex = 0;
let score = 0;
let isFeedbackShowing = false;

function initGame() {
    container.innerHTML = '';
    container.appendChild(endCard); // Ensure end card is in DOM
    endCard.classList.add('hidden');
    if (feedbackPopup) feedbackPopup.classList.add('hidden');
    isFeedbackShowing = false;

    score = 0;
    scoreEl.textContent = '0';
    currentIndex = 0;

    // Create cards in reverse order so first index is on top
    [...factsData].reverse().forEach((data, index) => {
        const card = document.createElement('div');
        card.className = 'tinder-card absolute inset-0 bg-white p-8 flex flex-col items-center justify-center text-center select-none cursor-grab active:cursor-grabbing';
        card.style.zIndex = index + 1;

        card.innerHTML = `
            <div class="stamp stamp-fact border-green-500 text-green-500">FACT</div>
            <div class="stamp stamp-fiction border-red-500 text-red-500">FICTION</div>
            <div class="flex-grow flex items-center justify-center">
                <h2 class="text-xl md:text-2xl font-bold text-gray-800 leading-snug">${data.text}</h2>
            </div>
            <p class="mt-4 text-xs text-gray-400 font-bold uppercase tracking-wider">Swipe or Click Button</p>
        `;

        // Touch/Mouse logic needed
        initDrag(card, factsData.length - 1 - index);
        container.appendChild(card);
    });
}

function initDrag(card, dataIndex) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const onStart = (e) => {
        if (isFeedbackShowing) return;
        isDragging = true;
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        card.style.transition = 'none';
    };

    const onMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        currentX = clientX - startX;
        const rotate = currentX * 0.1;

        card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;

        // Show stamps
        const factStamp = card.querySelector('.stamp-fact');
        const fictionStamp = card.querySelector('.stamp-fiction');

        if (currentX > 50) {
            factStamp.style.display = 'block';
            factStamp.style.opacity = Math.min(1, (currentX - 50) / 50);
        } else if (currentX < -50) {
            fictionStamp.style.display = 'block';
            fictionStamp.style.opacity = Math.min(1, (-currentX - 50) / 50);
        } else {
            factStamp.style.display = 'none';
            fictionStamp.style.display = 'none';
        }
    };

    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;

        if (currentX > 100) {
            handleSwipe(card, dataIndex, true); // Right = Fact
        } else if (currentX < -100) {
            handleSwipe(card, dataIndex, false); // Left = Fiction
        } else {
            // Reset
            card.style.transition = 'transform 0.3s ease-out';
            card.style.transform = 'translateX(0) rotate(0)';
            card.querySelector('.stamp-fact').style.display = 'none';
            card.querySelector('.stamp-fiction').style.display = 'none';
        }
    };

    card.addEventListener('mousedown', onStart);
    card.addEventListener('touchstart', onStart);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });

    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
}

function handleSwipe(card, dataIndex, isRightSwipe) {
    if (isFeedbackShowing) return;
    isFeedbackShowing = true;

    // Remove listeners roughly handled by removing element, strictly we should remove from document
    // logic simplified for hackathon speed

    const data = factsData[dataIndex];
    const isCorrect = (isRightSwipe && data.isFact) || (!isRightSwipe && !data.isFact);

    if (isCorrect) score++;
    scoreEl.textContent = score;

    // Animate out
    card.style.transition = 'transform 0.5s ease-out, opacity 0.5s';
    card.style.transform = `translateX(${isRightSwipe ? 1000 : -1000}px) rotate(${isRightSwipe ? 30 : -30}deg)`;
    card.style.opacity = '0';

    setTimeout(() => {
        card.remove();
        showFeedback(isCorrect, data.explanation);
    }, 300);
}

function showFeedback(isCorrect, explanation) {
    if (feedbackPopup) {
        feedbackPopup.classList.remove('hidden');
        if (isCorrect) {
            feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-check text-green-500"></i>';
            feedbackTitle.textContent = 'Correct!';
            feedbackTitle.className = 'text-3xl font-extrabold mb-3 text-green-600';
        } else {
            feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-xmark text-red-500"></i>';
            feedbackTitle.textContent = 'Incorrect!';
            feedbackTitle.className = 'text-3xl font-extrabold mb-3 text-red-600';
        }
        feedbackExplanation.textContent = explanation;
    } else {
        alert((isCorrect ? "Correct!\n\n" : "Incorrect!\n\n") + explanation);
        feedbackDone();
    }
}

function feedbackDone() {
    if (feedbackPopup) feedbackPopup.classList.add('hidden');
    isFeedbackShowing = false;
    currentIndex++;
    if (currentIndex >= factsData.length) {
        showEndScreen();
    }
}

if (btnNext) btnNext.onclick = feedbackDone;

// Button controls
document.getElementById('btn-fact').onclick = () => {
    if (isFeedbackShowing) return;
    const card = container.lastElementChild;
    // Don't target end-card if visible
    if (card && !card.id) {
        // Find current top card
        const cards = document.querySelectorAll('.tinder-card');
        const topCard = cards[cards.length - 1]; // last appended is on top index
        if (topCard) handleSwipe(topCard, currentIndex, true);
    }
};

document.getElementById('btn-fiction').onclick = () => {
    if (isFeedbackShowing) return;
    const cards = document.querySelectorAll('.tinder-card');
    const topCard = cards[cards.length - 1];
    if (topCard) handleSwipe(topCard, currentIndex, false);
};

function showEndScreen() {
    endCard.classList.remove('hidden');
    finalScoreEl.textContent = score;
}

window.restartGame = initGame;
initGame();

const wordData = [
    { word: "RITU KARIDHAL", hint: "Known as the Rocket Woman of India (Chandrayaan-2)" },
    { word: "TESSY THOMAS", hint: "First woman to head an Indian missile project (Agni-IV)" },
    { word: "KALPANA CHAWLA", hint: "First woman of Indian origin in space" },
    { word: "JANAKI AMMAL", hint: "Pioneering Indian botanist and cytogeneticist" },
    { word: "MIRA MURATI", hint: "Former CTO of OpenAI, behind ChatGPT" },
    { word: "KIRAN MAZUMDAR", hint: "Founder of Biocon, India's largest biopharmaceutical company" }
];

let currentIndex = 0;
const hintText = document.getElementById('hint-text');
const scrambledEl = document.getElementById('scrambled-word');
const inputEl = document.getElementById('user-input');
const feedbackEl = document.getElementById('feedback');
const gameContent = document.getElementById('game-content');
const endScreen = document.getElementById('end-screen');

function shuffleWord(word) {
    // Preserve spaces for multi-word names, but shuffle letters within words or globally?
    // Let's shuffle globally but keep space count? Or just remove spaces for scramble?
    // User expects spaces in answer? Let's check answer ignoring spaces.

    // Approach: Remove spaces, shuffle letters.
    const letters = word.replace(/\s/g, '').split('');
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join(' ').toUpperCase(); // Add spaces for visual chaos
}

function loadWord() {
    const data = wordData[currentIndex];
    hintText.textContent = `"${data.hint}"`;
    scrambledEl.textContent = shuffleWord(data.word);
    inputEl.value = '';
    feedbackEl.textContent = '';
    feedbackEl.className = 'mt-4 font-bold h-6';
}

function checkAnswer() {
    const userAns = inputEl.value.trim().toUpperCase().replace(/\s/g, ''); // ignore spaces
    const correctAns = wordData[currentIndex].word.toUpperCase().replace(/\s/g, '');

    if (userAns === correctAns) {
        feedbackEl.textContent = "CORRECT!";
        feedbackEl.className = 'mt-4 font-bold h-6 text-green-500 animate-bounce';

        setTimeout(() => {
            currentIndex++;
            if (currentIndex < wordData.length) {
                loadWord();
            } else {
                gameContent.classList.add('hidden');
                endScreen.classList.remove('hidden');
            }
        }, 1200);
    } else {
        feedbackEl.textContent = "Try again!";
        feedbackEl.className = 'mt-4 font-bold h-6 text-red-500 animate-shake';
        setTimeout(() => feedbackEl.classList.remove('animate-shake'), 500);
    }
}

function skipWord() {
    currentIndex++;
    if (currentIndex < wordData.length) {
        loadWord();
    } else {
        gameContent.classList.add('hidden');
        endScreen.classList.remove('hidden');
    }
}

function restartGame() {
    currentIndex = 0;
    gameContent.classList.remove('hidden');
    endScreen.classList.add('hidden');
    loadWord();
}

// Enter key support
inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

// Init
loadWord();

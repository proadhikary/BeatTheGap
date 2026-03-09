const questions = [
    {
        text: "What percentage of STEM graduates in India are women?",
        answer: 43,
        explanation: "India has a surprisingly high percentage of female STEM graduates (43%), significantly higher than the US (34%), UK (38%), and Germany (27%)."
    },
    {
        text: "What percentage of the global AI workforce is female?",
        answer: 22,
        explanation: "Only 22% of AI professionals globally are female, according to the World Economic Forum 2018 report."
    },
    {
        text: "What percentage of Indian startups are led by women founders?",
        answer: 18,
        explanation: "Approximately 18% of startups in India have at least one woman founder, a number that is slowly but steadily rising."
    },
    {
        text: "Women hold what percentage of leadership roles in tech companies globally?",
        answer: 28,
        explanation: "Women hold roughly 28% of leadership positions in the tech industry, showing a persistent gap at the top."
    },
    {
        text: "What percentage of Nobel Prizes in Physics have been awarded to women since 1901?",
        answer: 5,
        explanation: "Since the Nobel Prizes began in 1901, Physics has been awarded more than 220 times. Only a handful of those laureates have been women — historically fewer than 10."
    },
    {
        text: "What percentage of venture capital funding worldwide goes to startups founded solely by women?",
        answer: 3,
        explanation: "Globally, venture capital (VC) funding overwhelmingly goes to companies founded by all-male teams. Startups founded only by women typically receive about 2–3% of total VC dollars annually."
    },
    {
        text: "What percentage of health research funding globally is allocated to women's health issues (excluding reproductive health)?",
        answer: 5,
        explanation: "Most public and private health research funding is not disaggregated by sex-specific impact. The percentage of funds directed toward female-specific diseases and conditions is frequently under 5% of total biomedical research budgets."
    },
    {
        text: "What percentage of IIT faculty members are women?",
        answer: 11,
        explanation: "Across the IITs, women generally make up about 10–12% of faculty members. In core engineering departments (mechanical, electrical, civil), representation can fall below 5%."
    }
];

let currentIndex = 0;
const slider = document.getElementById('guess-slider');
const bubble = document.getElementById('guess-bubble');
const questionText = document.getElementById('question-text');
const resultsArea = document.getElementById('results-area');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const userGuessDisplay = document.getElementById('user-guess-display');
const actualDataDisplay = document.getElementById('actual-data-display');
const barUser = document.getElementById('bar-user');
const barActual = document.getElementById('bar-actual');
const factExplanation = document.getElementById('fact-explanation');
const gameContent = document.getElementById('game-content');
const endScreen = document.getElementById('end-screen');

function updateBubble(val) {
    bubble.textContent = `${val}%`;
    const percent = val / 100;
    // rough positioning adjustment
    const offset = percent * (slider.offsetWidth - 24);
    bubble.style.left = `calc(${percent * 100}% + (${12 - 24 * percent}px))`;
    // simpler center logic
    // bubble.style.left = `${percent * 100}%`; 
    // This is generally handled better by just % and transform, let's keep it simple CSS driven if possible or stick to simple
    bubble.style.left = `calc(${val}% + (${8 - val * 0.15}px))`;
}

slider.addEventListener('input', (e) => {
    updateBubble(e.target.value);
});

function loadQuestion() {
    const q = questions[currentIndex];
    questionText.textContent = q.text;
    slider.value = 50;
    updateBubble(50);

    resultsArea.classList.add('hidden');
    submitBtn.classList.remove('hidden');
    nextBtn.classList.add('hidden');
    slider.disabled = false;
}

function submitGuess() {
    const guess = parseInt(slider.value);
    const q = questions[currentIndex];

    slider.disabled = true;
    submitBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
    resultsArea.classList.remove('hidden');

    userGuessDisplay.textContent = `${guess}%`;
    actualDataDisplay.textContent = `${q.answer}%`;

    barUser.style.width = `${guess}%`;
    barActual.style.width = `${q.answer}%`;

    factExplanation.textContent = q.explanation;
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex < questions.length) {
        loadQuestion();
    } else {
        gameContent.classList.add('hidden');
        endScreen.classList.remove('hidden');
    }
}

function restartGame() {
    currentIndex = 0;
    gameContent.classList.remove('hidden');
    endScreen.classList.add('hidden');
    loadQuestion();
}

// Initial load
loadQuestion();

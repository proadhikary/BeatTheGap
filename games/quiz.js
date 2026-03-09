const questions = [
    {
        question: "Globally, what percentage of AI professionals are women?",
        options: ["12%", "22%", "38%", "50%"],
        correct: 1,
        explanation: "Only about 1 in 5 AI professionals globally are women, showing a significant representation gap."
    },
    {
        question: "In India, what percentage of STEM graduates are women?",
        options: ["18%", "28%", "43%", "60%"],
        correct: 2,
        explanation: "India actually has one of the highest shares of women STEM graduates globally."
    },
    {
        question: "Which Indian scientist led the Mars Orbiter Mission (Mangalyaan)?",
        options: ["Tessy Thomas", "Ritu Karidhal Srivastava", "Nandini Harinath", "Kalpana Chawla"],
        correct: 1,
        explanation: "Ritu Karidhal was one of the key scientists behind India's successful Mars mission in 2014."
    },
    {
        question: "Which phenomenon describes invisible barriers preventing women from reaching leadership roles?",
        options: ["Silicon Barrier", "Glass Ceiling", "Leadership Gap", "Gender Divide"],
        correct: 1,
        explanation: "The Glass Ceiling refers to systemic barriers preventing advancement."
    },
    {
        question: "Which field historically had the first computer programmer?",
        options: ["Artificial Intelligence", "Cybersecurity", "Computer Science", "Robotics"],
        correct: 2,
        explanation: "Ada Lovelace wrote the first algorithm intended for a machine in the 1840s."
    }
];

let currentQuestionIndex = 0;
let score = 0;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const nextBtn = document.getElementById('next-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackText = document.getElementById('feedback-text');
const currentQuestionSpan = document.getElementById('current-question');
const currentScoreSpan = document.getElementById('current-score');
const finalScoreSpan = document.getElementById('final-score');
const resultMessage = document.getElementById('result-message');
const progressBar = document.getElementById('progress-bar');
const resultIcon = document.getElementById('result-icon');

// Event Listeners
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    currentScoreSpan.textContent = '0';
    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    loadQuestion();
}

function loadQuestion() {
    const q = questions[currentQuestionIndex];
    questionText.textContent = q.question;
    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    // Update progress bar
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;

    optionsContainer.innerHTML = '';
    feedbackContainer.classList.add('hidden');
    feedbackContainer.className = 'hidden mt-6 p-4 rounded-lg bg-gray-50 border-l-4'; // Reset classes

    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition-all font-medium text-gray-700';
        btn.textContent = option;
        btn.onclick = () => selectOption(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function selectOption(selectedIndex, btn) {
    const q = questions[currentQuestionIndex];
    const buttons = optionsContainer.querySelectorAll('button');

    // Disable all buttons
    buttons.forEach(b => b.disabled = true);

    const isCorrect = selectedIndex === q.correct;

    if (isCorrect) {
        score++;
        currentScoreSpan.textContent = score;
        btn.classList.add('bg-green-100', 'border-green-500', 'text-green-800');
        btn.innerHTML += ' <i class="fa fa-check float-right mt-1"></i>';

        feedbackContainer.classList.remove('hidden');
        feedbackContainer.classList.add('border-green-500', 'bg-green-50');
        feedbackText.innerHTML = `<strong class="text-green-700">Correct!</strong> ${q.explanation}`;
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
        });
    } else {
        btn.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
        btn.innerHTML += ' <i class="fa fa-times float-right mt-1"></i>';

        // Highlight correct answer
        buttons[q.correct].classList.add('bg-green-100', 'border-green-500', 'text-green-800');

        feedbackContainer.classList.remove('hidden');
        feedbackContainer.classList.add('border-red-500', 'bg-red-50');
        feedbackText.innerHTML = `<strong class="text-red-700">Incorrect.</strong> ${q.explanation}`;
    }
}

function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    finalScoreSpan.textContent = score;

    if (score === 5) {
        resultMessage.textContent = "Outstanding! You are a true champion for gender equality in AI!";
        resultIcon.className = "fa-solid fa-crown text-6xl text-yellow-400 mb-4 animate-bounce";
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
        });
    } else if (score >= 3) {
        resultMessage.textContent = "Great job! You have a good understanding of the landscape.";
        resultIcon.className = "fa-solid fa-star text-6xl text-yellow-400 mb-4 animate-pulse";
    } else {
        resultMessage.textContent = "Good effort! There's always more to learn about bridging the gap.";
        resultIcon.className = "fa-solid fa-medal text-6xl text-gray-400 mb-4";
    }
}

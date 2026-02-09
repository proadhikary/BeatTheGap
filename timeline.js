const timelineList = document.getElementById('timeline-list');
const resultModal = document.getElementById('result-modal');
const modalTitle = document.getElementById('modal-title');
const modalMsg = document.getElementById('modal-msg');
const modalIcon = document.getElementById('modal-icon');
const nextLevelBtn = document.getElementById('next-level-btn');
const retryBtn = document.getElementById('retry-btn');

const levels = [
    [
        { id: 1, text: "Indian Science Congress Association formed", year: 1914 },
        { id: 2, text: "Janaki Ammal receives PhD in Botany", year: 1931 },
        { id: 3, text: "Kalpana Chawla's first space mission", year: 1997 },
        { id: 4, text: "Chandrayaan-2 Mission (Ritu Karidhal as Mission Director)", year: 2019 }
    ],
    [
        { id: 1, text: "Anandibai Joshi graduates as first Indian female physician", year: 1886 },
        { id: 2, text: "Establishment of the first IIT (Kharagpur)", year: 1951 },
        { id: 3, text: "Sudha Murty becomes first female engineer at TATA", year: 1974 },
        { id: 4, text: "N. Kalaiselvi becomes first female DG of CSIR", year: 2022 }
    ]
];

let currentLevel = 0;
let sortable;

function initLevel() {
    timelineList.innerHTML = '';
    const items = [...levels[currentLevel]];
    // Shuffle items for the game start
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }

    items.forEach(item => {
        const li = document.createElement('div');
        li.className = "bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500 cursor-move flex items-center justify-between group hover:bg-orange-50 transition-colors";
        li.dataset.year = item.year;
        li.innerHTML = `
            <span class="font-medium text-gray-800">${item.text}</span>
            <i class="fa-solid fa-grip-lines text-gray-300 group-hover:text-orange-400"></i>
        `;
        timelineList.appendChild(li);
    });

    if (sortable) sortable.destroy();
    sortable = new Sortable(timelineList, {
        animation: 150,
        ghostClass: 'sortable-ghost'
    });
}

function checkOrder() {
    const items = timelineList.children;
    let isCorrect = true;
    let prevYear = -Infinity;

    for (let item of items) {
        const year = parseInt(item.dataset.year);
        if (year < prevYear) {
            isCorrect = false;
            break;
        }
        prevYear = year;
    }

    resultModal.classList.remove('hidden');

    if (isCorrect) {
        modalTitle.textContent = "Correct Order!";
        modalMsg.textContent = "You've successfully traced the path of history.";
        modalIcon.className = "h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl text-green-500";
        modalIcon.innerHTML = '<i class="fa-solid fa-check"></i>';

        if (currentLevel < levels.length - 1) {
            nextLevelBtn.classList.remove('hidden');
            retryBtn.classList.add('hidden');
        } else {
            modalMsg.textContent = "You've completed all timeline challenges!";
            nextLevelBtn.classList.add('hidden');
            retryBtn.classList.add('hidden');
        }
    } else {
        modalTitle.textContent = "Not Quite...";
        modalMsg.textContent = "Some events seem out of place. Try reviewing the dates!";
        modalIcon.className = "h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl text-red-500";
        modalIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        nextLevelBtn.classList.add('hidden');
        retryBtn.classList.remove('hidden');
    }
}

function nextLevel() {
    currentLevel++;
    closeModal();
    initLevel();
}

function closeModal() {
    resultModal.classList.add('hidden');
}

initLevel();

const facts = [
    {
        title: "The Rocket Woman of India",
        text: "Ritu Karidhal, dubbed the 'Rocket Woman of India', was the Mission Director of Chandrayaan-2. Her leadership in India's space missions inspires countless women to pursue aerospace and AI-driven navigation systems.",
        icon: "fa-rocket",
        color: "bg-blue-100 text-blue-600"
    },
    {
        title: "First Woman to Head a CSIR Lab",
        text: "Dr. N. Kalaiselvi became the first woman Director General of the Council of Scientific and Industrial Research (CSIR) in its 80-year history, breaking a significant glass ceiling in Indian scientific administration.",
        icon: "fa-flask",
        color: "bg-green-100 text-green-600"
    },
    {
        title: "AI for Social Good",
        text: "Many Indian women startups are leveraging AI for social impact. For example, NIRAMAI, founded by Dr. Geetha Manjunath, uses AI-based thermal analytics for early breast cancer screening, saving lives affordably.",
        icon: "fa-heart-pulse",
        color: "bg-pink-100 text-pink-600"
    },
    {
        title: "Global AI Leadership",
        text: "Mira Murati, of Albanian-Indian descent, served as the CTO of OpenAI, the company behind ChatGPT. She played a pivotal role in the development and deployment of some of the most advanced AI models in the world.",
        icon: "fa-robot",
        color: "bg-purple-100 text-purple-600"
    },
    {
        title: "Breaking Barriers in Tech",
        text: "Debjani Ghosh is the first woman President of NASSCOM in its 30-year history. She advocates strongly for 'AI for All' and digital skilling for women across India.",
        icon: "fa-network-wired",
        color: "bg-yellow-100 text-yellow-600"
    },
    {
        title: "IIT Diversity – Fiction vs. Reality",
        text: "Less than 1% of professors at IITs come from Adivasi and Dalit communities. This contradicts claims of fair representation of marginalized communities, according to data provided to Nature through right-to-information requests (2020).",
        icon: "fa-graduation-cap",
        color: "bg-orange-100 text-orange-600"
    }
];

let currentIndex = 0;
const cardStack = document.getElementById('card-stack');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function renderCard(index, direction = 'next') {
    // Clear existing content
    cardStack.innerHTML = '';

    const fact = facts[index];

    // Create new card
    const card = document.createElement('div');
    card.className = `absolute inset-0 bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center justify-center transform transition-all duration-500 ease-in-out`;

    // Initial animation state
    if (direction === 'next') {
        card.classList.add('translate-x-full', 'opacity-0');
    } else if (direction === 'prev') {
        card.classList.add('-translate-x-full', 'opacity-0');
    }

    card.innerHTML = `
        <div class="h-24 w-24 ${fact.color} rounded-full flex items-center justify-center mb-6 shadow-sm">
            <i class="fa-solid ${fact.icon} text-4xl"></i>
        </div>
        <h2 class="text-2xl font-bold mb-4 text-gray-800">${fact.title}</h2>
        <p class="text-gray-600 text-lg leading-relaxed mb-6">"${fact.text}"</p>
        <div class="mt-auto">
            <span class="text-sm font-bold text-gray-400">Fact ${index + 1} of ${facts.length}</span>
        </div>
    `;

    cardStack.appendChild(card);

    // Trigger reflow to enable transition
    void card.offsetWidth;

    // Remove animation classes to settle card in center
    card.classList.remove('translate-x-full', '-translate-x-full', 'opacity-0');
}

function nextCard() {
    currentIndex = (currentIndex + 1) % facts.length;
    renderCard(currentIndex, 'next');
}

function prevCard() {
    currentIndex = (currentIndex - 1 + facts.length) % facts.length;
    renderCard(currentIndex, 'prev');
}

// Event Listeners
nextBtn.addEventListener('click', nextCard);
prevBtn.addEventListener('click', prevCard);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextCard();
    if (e.key === 'ArrowLeft') prevCard();
});

// Touch Swipe Support
let touchStartX = 0;
let touchEndX = 0;

cardStack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

cardStack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        nextCard(); // Swiped Left -> Next
    }
    if (touchEndX > touchStartX + 50) {
        prevCard(); // Swiped Right -> Prev
    }
}

// Initial Render
renderCard(currentIndex, '');

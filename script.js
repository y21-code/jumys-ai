document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('auth-modal');
    if (localStorage.getItem('userName')) {
        if (modal) modal.classList.add('hidden');
        renderJobs();
    }
});

function saveProfile() {
    const name = document.getElementById('user-name').value;
    const skills = document.getElementById('user-skills').value;
    if (name.trim() && skills.trim()) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userSkills', skills.toLowerCase());
        document.getElementById('auth-modal').classList.add('hidden');
        renderJobs();
    } else {
        alert("Заполни поля, бро!");
    }
}

function renderJobs() {
    const container = document.querySelector('.jobs-container');
    const userSkills = localStorage.getItem('userSkills') || "";

    const staticJobs = [
        { title: "Python-разработчик", loc: "IT Hub Aktau", tags: ["python", "код"], baseChance: 30 },
        { title: "Бариста", loc: "Coffee Day (14 мкр)", tags: ["кофе", "люди"], baseChance: 60 },
        { title: "Курьер", loc: "Актау, Весь город", tags: ["доставка", "машина"], baseChance: 70 }
    ];

    container.innerHTML = '';

    staticJobs.forEach((job, index) => {
        const matches = job.tags.filter(tag => userSkills.includes(tag));
        let chance = job.baseChance + (matches.length * 35);
        if (chance > 99) chance = 99;

        let aiText = matches.length > 0 
            ? `Твой опыт в **${matches[0]}** — это именно то, что нужно этому работодателю!` 
            : "Прямых совпадений нет, но ИИ считает, что ты быстро адаптируешься.";

        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="chance-tag">Шанс: ${chance}%</div>
            <h3>${job.title}</h3>
            <p>📍 ${job.loc}</p>
            <div class="chance-bar-container">
                <div class="chance-bar-fill" id="bar-${index}"></div>
            </div>
            <div class="ai-explanation">🤖 <strong>AI:</strong> ${aiText}</div>
            <button class="apply-btn" onclick="applyJob('${job.title}')">Откликнуться со Smart Resume</button>
        `;
        container.appendChild(card);

        // Анимация полоски через микро-задержку
        setTimeout(() => {
            document.getElementById(`bar-${index}`).style.width = chance + '%';
        }, 100);
    });
}

function applyJob(title) {
    const name = localStorage.getItem('userName');
    const skills = localStorage.getItem('userSkills');

    fetch('/api/apply', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ jobTitle: title, studentName: name, studentSkills: skills })
    })
    .then(res => res.json())
    .then(() => alert("Отклик и Smart Resume отправлены работодателю в ТГ! ✅"))
    .catch(() => alert("Ошибка! Проверь сервер."));
}

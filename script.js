document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('auth-modal');
    // Если имя уже есть, сразу прячем окно
    if (localStorage.getItem('userName')) {
        modal.classList.add('hidden');
        renderJobs();
    }
});

function saveProfile() {
    const name = document.getElementById('user-name').value;
    const skills = document.getElementById('user-skills').value;

    if (name.trim() && skills.trim()) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userSkills', skills.toLowerCase());

        const modal = document.getElementById('auth-modal');
        modal.classList.add('hidden'); // Убираем невидимую стену
        
        renderJobs();
    } else {
        alert("Пожалуйста, заполни поля!");
    }
}

function renderJobs() {
    const jobsContainer = document.querySelector('.jobs-container');
    const userSkills = (localStorage.getItem('userSkills') || "");

    const allJobs = [
        { 
            title: "Python Разработчик (Стажер)", 
            loc: "IT Hub Aktau", 
            tags: ["python", "код", "программирование", "разработка"],
            baseChance: 40
        },
        { 
            title: "Бариста", 
            loc: "14 мкр, Coffee Day", 
            tags: ["люди", "кофе", "общительный"],
            baseChance: 60
        },
        { 
            title: "SMM-менеджер", 
            loc: "Digital Agency", 
            tags: ["инстаграм", "фото", "контент"],
            baseChance: 50
        }
    ];

    jobsContainer.innerHTML = '';

    allJobs.forEach(job => {
        // Ищем совпадения навыков
        const matches = job.tags.filter(tag => userSkills.includes(tag));
        
        // Если есть совпадение по Python, шанс взлетает
        let chance = job.baseChance + (matches.length * 30);
        if (chance > 99) chance = 99;

        let aiReason = "";
        if (matches.length > 0) {
            aiReason = `Твой опыт в (${matches.join(", ")}) — это именно то, что нужно!`;
        } else {
            aiReason = `Пока нет прямых совпадений, но твоя база поможет быстро обучиться.`;
        }

        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="chance-tag">Шанс: ${chance}%</div>
            <h3>${job.title}</h3>
            <p class="location">📍 ${job.loc}</p>
            <div class="ai-explanation">
                <p>🤖 <strong>AI Анализ:</strong> ${aiReason}</p>
            </div>
            <button class="apply-btn" onclick="applyJob('${job.title}', '${job.loc}')">Откликнуться со Smart Resume</button>
        `;
        jobsContainer.appendChild(card);
    });
}

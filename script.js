document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('auth-modal');
    if (!localStorage.getItem('userName')) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    } else {
        modal.classList.add('hidden');
        renderJobs();
    }
});

function saveProfile() {
    const name = document.getElementById('user-name').value;
    const skills = document.getElementById('user-skills').value;

    if (name.trim() && skills.trim()) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userSkills', skills.toLowerCase()); // Сохраняем в маленьком регистре для поиска

        const modal = document.getElementById('auth-modal');
        modal.classList.add('hidden'); // Полностью прячем
        
        renderJobs();
    } else {
        alert("Заполни имя и навыки!");
    }
}

function renderJobs() {
    const jobsContainer = document.querySelector('.jobs-container');
    const userSkills = (localStorage.getItem('userSkills') || "").toLowerCase();

    const allJobs = [
        { 
            title: "Бариста", 
            loc: "14 мкр, Coffee Day", 
            tags: ["люди", "кофе", "общительный", "энергичный"],
            baseChance: 60
        },
        { 
            title: "SMM-помощник", 
            loc: "Креативное агентство", 
            tags: ["инстаграм", "фото", "видео", "дизайн", "python"], // Python может быть полезен для парсинга
            baseChance: 50
        },
        { 
            title: "Курьер", 
            loc: "Весь город", 
            tags: ["машина", "самокат", "быстрый", "доставка"],
            baseChance: 70
        },
        { 
            title: "IT-стажер", 
            loc: "Digital Office Aktau", 
            tags: ["python", "код", "программирование", "компьютер"],
            baseChance: 40
        }
    ];

    jobsContainer.innerHTML = '';

    allJobs.forEach(job => {
        // Проверяем, есть ли хоть одно совпадение навыков студента с тегами вакансии
        const matches = job.tags.filter(tag => userSkills.includes(tag));
        let finalChance = job.baseChance + (matches.length * 15); // За каждое совпадение +15%
        if (finalChance > 99) finalChance = 99;

        // Если есть совпадение, показываем умное объяснение. Если нет - стандартное.
        let aiReason = "";
        if (matches.length > 0) {
            aiReason = `Твои навыки (${matches.join(", ")}) отлично подходят здесь!`;
        } else {
            aiReason = `Эта работа поможет тебе развить базовые навыки, пока ты ищешь вакансии в IT.`;
        }

        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="chance-tag">Шанс: ${finalChance}%</div>
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

function applyJob(title, loc) {
    const userName = localStorage.getItem('userName');
    const userSkills = localStorage.getItem('userSkills');

    fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            jobTitle: title, 
            location: loc,
            studentName: userName,
            studentSkills: userSkills
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) alert('Smart Resume отправлено! ✅');
    })
    .catch(() => alert('Ошибка сервера'));
}

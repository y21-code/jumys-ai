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
    const userSkills = localStorage.getItem('userSkills') || "";

    const allJobs = [
        { title: "Бариста", loc: "14 мкр, Coffee Day", chance: "92%", tags: ["кофе", "общительный", "люди", "кафе"] },
        { title: "SMM-помощник", loc: "Креативное агентство", chance: "85%", tags: ["инстаграм", "фото", "видео", "соцсети", "дизайн"] },
        { title: "Помощник админа", loc: "27 мкр, БЦ Каспий", chance: "65%", tags: ["excel", "компьютер", "офис", "таблицы"] },
        { title: "Курьер", loc: "Весь город", chance: "95%", tags: ["машина", "права", "самокат", "быстрый", "доставка"] },
        { title: "Официант", loc: "Набережная", chance: "80%", tags: ["ресторан", "сервис", "еда", "люди"] }
    ];

    // МАГИЯ AI: Фильтруем вакансии по ключевым словам из твоих навыков
    let filteredJobs = allJobs.filter(job => {
        return job.tags.some(tag => userSkills.includes(tag));
    });

    // Если ничего не подошло, показываем всё, чтобы сайт не был пустым
    if (filteredJobs.length === 0) filteredJobs = allJobs;

    jobsContainer.innerHTML = '';
    filteredJobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="chance-tag">${job.chance}</div>
            <h3>${job.title}</h3>
            <p class="location">📍 ${job.loc}</p>
            <div class="ai-explanation">
                <p>🤖 <strong>AI Анализ:</strong> Подходит под твои навыки: ${userSkills}</p>
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

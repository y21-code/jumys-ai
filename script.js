document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userName')) {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('hidden');
        renderJobs();
    }
});

function saveProfile() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    const tg = document.getElementById('user-tg').value;
    const skills = document.getElementById('user-skills').value;
    const district = document.getElementById('user-district').value;

    if (name.trim() && phone.trim() && skills.trim()) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userTG', tg);
        localStorage.setItem('userSkills', skills.toLowerCase());
        localStorage.setItem('userDistrict', district);
        document.getElementById('auth-modal').classList.add('hidden');
        renderJobs();
    } else {
        alert("Заполни все поля, бро! 🤖");
    }
}

function renderJobs() {
    const container = document.querySelector('.jobs-container');
    const userSkills = localStorage.getItem('userSkills') || "";
    const userDistrict = (localStorage.getItem('userDistrict') || "").toLowerCase();

    // Расширенные данные вакансий для Edu-блока
    const jobs = [
        { 
            title: "Python-разработчик", 
            loc: "IT Hub (14 мкр)", 
            tags: ["python", "код"], 
            baseChance: 40, 
            road: "14 мкр",
            missing: ["код", "логика"],
            course: "Основы Python на Stepik",
            courseColor: "#6366f1" // Сиреневый
        },
        { 
            title: "Бариста", 
            loc: "Coffee Day (14 мкр)", 
            tags: ["кофе", "люди"], 
            baseChance: 60, 
            road: "14 мкр",
            missing: ["кофе", "сервис"],
            course: "Мастер-класс по латте-арт",
            courseColor: "#00ff88" // Бирюзовый
        },
        { 
            title: "Менеджер", 
            loc: "БЦ Каспий (9 мкр)", 
            tags: ["excel", "звонки"], 
            baseChance: 30, 
            road: "9 мкр",
            missing: ["excel", "переговоры"],
            course: "Курс 'Excel для начинающих'",
            courseColor: "#FFD700" // Золотой
        }
    ];

    container.innerHTML = '';

    jobs.forEach((job, index) => {
        let chance = job.baseChance;
        const matches = job.tags.filter(tag => userSkills.includes(tag));
        if (matches.length > 0) chance += 30;
        if (userDistrict.includes(job.road.toLowerCase())) chance += 20;
        if (chance > 99) chance = 99;

        // --- ГЕНЕРАЦИЯ ПЕРСОНАЛИЗИРОВАННОГО AI ТЕКСТА ---
        let aiText = "";
        if (matches.length > 0) {
            aiText = `Слушай, твои навыки в **${matches[0]}** — это просто пушка для этой вакансии! Работа в твоем районе!`;
        } else {
            aiText = `Тут ищут тех, кто шарит в ${job.tags[0]}, но твое рвение может это перекрыть. Попробуй!`;
        }

        const card = document.createElement('div');
        card.className = 'job-card';
        // ВЕРСТКА ПОД РЕФЕРЕНС (Фото №1)
        card.innerHTML = `
            <div class="chance-tag">Шанс: ${chance}%</div>
            <h3>${job.title}</h3>
            <p class="job-location">📍 ${job.loc}</p>
            
            <div class="progress-container">
                <div class="progress-bar" id="bar-${index}"></div>
            </div>
            
            <div class="ai-box">
                <p>🤖 <b>Jumys AI:</b> ${aiText}</p>
            </div>

            <div class="edu-box" style="border-left: 3px solid ${job.courseColor};">
                📚 <b>ИИ советует подтянуть:</b> ${job.missing.join(', ')}.<br>
                <a href="#">Посмотреть бесплатный курс: ${job.course}</a>
            </div>

            <button class="apply-btn" onclick="applyJob('${job.title}', ${chance})">ОТКЛИКНУТЬСЯ CO SMART RESUME</button>
        `;
        container.appendChild(card);

        // Анимация полоски
        setTimeout(() => {
            const bar = document.getElementById(`bar-${index}`);
            if (bar) bar.style.width = chance + '%';
        }, 150);
    });
}

function applyJob(title, chance) {
    const data = {
        jobTitle: title,
        studentName: localStorage.getItem('userName'),
        studentPhone: localStorage.getItem('userPhone'),
        studentTG: localStorage.getItem('userTG'),
        studentSkills: localStorage.getItem('userSkills'),
        chance: chance
    };

    fetch('/api/apply', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(() => alert("✅ Твой Smart Resume улетел работодателю!"))
    .catch(() => alert("Бот получил уведомление! (Demo)"));
}

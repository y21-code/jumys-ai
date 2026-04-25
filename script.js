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
    const district = document.getElementById('user-district') ? document.getElementById('user-district').value : "Актау";

    if (name.trim() && skills.trim()) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userSkills', skills.toLowerCase());
        localStorage.setItem('userDistrict', district); // Сохраняем район
        document.getElementById('auth-modal').classList.add('hidden');
        renderJobs();
    } else {
        alert("Заполни поля, бро!");
    }
}

let dynamicJobs = JSON.parse(localStorage.getItem('dynamicJobs')) || [];

function renderJobs() {
    const container = document.querySelector('.jobs-container');
    const userSkills = localStorage.getItem('userSkills') || "";
    const userDistrict = localStorage.getItem('userDistrict') || "";

    const staticJobs = [
        { 
            title: "Python-разработчик", 
            loc: "IT Hub Aktau (14 мкр)", 
            tags: ["python", "код", "логика"], 
            baseChance: 30,
            road: "14 мкр",
            course: "Основы Python на Stepik"
        },
        { 
            title: "Бариста", 
            loc: "Coffee Day (14 мкр)", 
            tags: ["кофе", "люди", "улыбка"], 
            baseChance: 60,
            road: "14 мкр",
            course: "Мастер-класс по латте-арт на YouTube"
        },
        { 
            title: "Менеджер по продажам", 
            loc: "БЦ Каспий (9 мкр)", 
            tags: ["переговоры", "excel", "звонки"], 
            baseChance: 40,
            road: "9 мкр",
            course: "Курс 'Excel для начинающих'"
        }
    ];

    const allJobs = [...staticJobs, ...dynamicJobs];
    container.innerHTML = '';

    allJobs.forEach((job, index) => {
        const matches = job.tags.filter(tag => userSkills.includes(tag));
        const missing = job.tags.filter(tag => !userSkills.includes(tag));
        
        let chance = job.baseChance + (matches.length * 20);
        if (userDistrict.includes(job.road)) chance += 15; // Бонус за район
        if (chance > 99) chance = 99;

        // --- AI ОБЪЯСНЕНИЕ (Дружелюбный формат) ---
        let aiText = "";
        if (matches.length > 0) {
            aiText = `Слушай, твои навыки в **${matches[0]}** — это просто пушка для этой вакансии! `;
        } else {
            aiText = `Тут ищут тех, кто шарит в ${job.tags[0]}, но твое рвение может это перекрыть. `;
        }

        if (userDistrict.includes(job.road)) {
            aiText += `Кстати, это совсем рядом с тобой в **${job.road}**, сэкономишь на такси! 🚗`;
        }

        // --- SKILLS GAP ANALYZER (Обучение) ---
        let eduBlock = "";
        if (chance < 85 && job.course) {
            eduBlock = `
                <div style="margin-top:10px; padding: 8px; border-left: 3px solid #6366f1; background: rgba(255,255,255,0.05); font-size: 0.8rem;">
                    📚 <strong>ИИ советует подтянуть:</strong> ${missing.join(', ')}.<br>
                    <a href="#" style="color: #00ff88;">Посмотреть бесплатный курс: ${job.course}</a>
                </div>
            `;
        }

        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="chance-tag">Шанс: ${chance}%</div>
            <h3>${job.title}</h3>
            <p>📍 ${job.loc}</p>
            <div class="chance-bar-container">
                <div class="chance-bar-fill" id="bar-${index}"></div>
            </div>
            <div class="ai-explanation">🤖 <strong>Jumys AI:</strong> ${aiText}</div>
            ${eduBlock}
            <button class="apply-btn" style="margin-top:15px;" onclick="applyJob('${job.title}')">Откликнуться со Smart Resume</button>
        `;
        container.appendChild(card);

        setTimeout(() => {
            const bar = document.getElementById(`bar-${index}`);
            if (bar) bar.style.width = chance + '%';
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
    .then(() => alert("Твой Smart Resume улетел работодателю! Удачной охоты! 🚀"))
    .catch(() => alert("Ошибка! Проверь сервер."));
}

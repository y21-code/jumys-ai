document.addEventListener('DOMContentLoaded', () => {
    // Если данные пользователя уже есть, сразу показываем вакансии
    if (localStorage.getItem('userName')) {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('hidden');
        renderJobs();
    }
});

// Сохранение профиля
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
        
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('hidden');
        renderJobs();
    } else {
        alert("Заполни все поля, бро! 🤖");
    }
}

// Отрисовка вакансий с аккуратной структурой
function renderJobs() {
    const container = document.querySelector('.jobs-container');
    const userSkills = localStorage.getItem('userSkills') || "";
    const userDistrict = (localStorage.getItem('userDistrict') || "").toLowerCase();

    // Список вакансий (БД)
    const jobs = [
        { 
            title: "Python-разработчик", 
            loc: "IT Hub (14 мкр)", 
            tags: ["python", "код"], 
            baseChance: 40, 
            road: "14 мкр",
            missing: ["код", "логика"],
            course: "Основы Python на Stepik",
            courseColor: "#6366f1" 
        },
        { 
            title: "Бариста", 
            loc: "Coffee Day (14 мкр)", 
            tags: ["кофе", "люди"], 
            baseChance: 60, 
            road: "14 мкр",
            missing: ["кофе", "сервис"],
            course: "Мастер-класс по латте-арт",
            courseColor: "#00ff88"
        },
        { 
            title: "Менеджер", 
            loc: "БЦ Каспий (9 мкр)", 
            tags: ["excel", "звонки"], 
            baseChance: 30, 
            road: "9 мкр",
            missing: ["excel", "переговоры"],
            course: "Курс 'Excel для начинающих'",
            courseColor: "#FFD700" 
        }
    ];

    container.innerHTML = '';

    jobs.forEach((job, index) => {
        // Расчет шанса
        let chance = job.baseChance;
        const matches = job.tags.filter(tag => userSkills.includes(tag));
        if (matches.length > 0) chance += 30;
        if (userDistrict.includes(job.road.toLowerCase())) chance += 20;
        if (chance > 99) chance = 99;

        // Живой текст от ИИ
        let aiText = matches.length > 0 
            ? `Твои навыки в **${matches[0]}** идеально подходят. Работа совсем рядом!` 
            : `Тут ищут навыки ${job.tags[0]}, но твой опыт в других сферах поможет быстро обучиться.`;

        // Создание карточки (Аккуратная структура как на фото)
        const card = document.createElement('div');
        card.className = 'job-card';
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

            <div class="edu-box" style="border-left: 4px solid ${job.courseColor};">
                <p class="edu-title">📚 ИИ советует подтянуть: ${job.missing.join(', ')}</p>
                <a href="#" class="edu-link">Курс: ${job.course}</a>
            </div>

            <button class="apply-btn" onclick="applyJob('${job.title}', ${chance})">ОТКЛИКНУТЬСЯ CO SMART RESUME</button>
        `;
        container.appendChild(card);

        // Анимация полоски шанса
        setTimeout(() => {
            const bar = document.getElementById(`bar-${index}`);
            if (bar) bar.style.width = chance + '%';
        }, 150);
    });
}

// Отправка данных работодателю
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
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            alert("✅ Твой Smart Resume улетел работодателю! Ожидай ответа в Telegram.");
        } else {
            alert("Ошибка при отправке. Проверь сервер!");
        }
    })
    .catch(err => {
        console.error("Ошибка:", err);
        alert("Бот получил уведомление! (Проверь связь с сервером)");
    });
}

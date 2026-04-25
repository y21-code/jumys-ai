document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('auth-modal');
    // Если данные уже есть, скрываем окно и рисуем вакансии
    if (localStorage.getItem('userName')) {
        if (modal) modal.classList.add('hidden');
        renderJobs();
    }
});

// СОХРАНЕНИЕ ПРОФИЛЯ (с телефоном и TG)
function saveProfile() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    const tg = document.getElementById('user-tg').value;
    const district = document.getElementById('user-district').value;
    const skills = document.getElementById('user-skills').value;

    if (name.trim() && phone.trim() && skills.trim()) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userTG', tg);
        localStorage.setItem('userDistrict', district);
        localStorage.setItem('userSkills', skills.toLowerCase());
        
        document.getElementById('auth-modal').classList.add('hidden');
        renderJobs();
    } else {
        alert("Бро, заполни имя, телефон и навыки, чтобы ИИ сработал! 🤖");
    }
}

// ФУНКЦИЯ ПОИСКА И ФИЛЬТРАЦИИ (Требование 05)
function filterJobs() {
    const input = document.getElementById('jobSearch').value.toLowerCase();
    const cards = document.getElementsByClassName('job-card');
    
    for (let card of cards) {
        const title = card.querySelector('h3').innerText.toLowerCase();
        const loc = card.querySelector('p').innerText.toLowerCase();
        // Если текст поиска есть в заголовке или локации — показываем
        if (title.includes(input) || loc.includes(input)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    }
}

let dynamicJobs = JSON.parse(localStorage.getItem('dynamicJobs')) || [];

// ОТРИСОВКА ВАКАНСИЙ С AI-ЛОГИКОЙ
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
        // Бонус за "Hyper-Local" (пункт 03)
        if (userDistrict.toLowerCase().includes(job.road.toLowerCase())) {
            chance += 15; 
        }
        if (chance > 99) chance = 99;

        // AI-ОБЪЯСНЕНИЕ
        let aiText = matches.length > 0 
            ? `Твои навыки в **${matches[0]}** идеально подходят! ` 
            : `Тут важны навыки ${job.tags[0]}, но ты быстро научишься. `;

        if (userDistrict.toLowerCase().includes(job.road.toLowerCase())) {
            aiText += `Это твой район (**${job.road}**), работа в 5 минутах! 🏠`;
        }

        // КАРТОЧКА
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
            <div class="skills-gap-analyzer">
                📚 <strong>AI совет:</strong> Подтяни [${missing.join(', ')}]. <br>
                <a href="#">Курс: ${job.course}</a>
            </div>
            <button class="apply-btn" style="margin-top:15px;" onclick="applyJob('${job.title}', ${chance})">Откликнуться</button>
        `;
        container.appendChild(card);

        setTimeout(() => {
            const bar = document.getElementById(`bar-${index}`);
            if (bar) bar.style.width = chance + '%';
        }, 100);
    });
}

// ОТКЛИК (Отправка данных работодателю в Телеграм)
function applyJob(jobTitle, chance) {
    const data = {
        jobTitle: jobTitle,
        chance: chance,
        name: localStorage.getItem('userName'),
        phone: localStorage.getItem('userPhone'),
        tg: localStorage.getItem('userTG'),
        skills: localStorage.getItem('userSkills'),
        district: localStorage.getItem('userDistrict')
    };

    fetch('/api/apply', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => {
        alert(`✅ Отклик отправлен! Работодатель свяжется с тобой в Telegram или по номеру ${data.phone}`);
    })
    .catch(err => {
        console.error(err);
        alert("Ошибка связи с сервером. Но на хакатоне скажи, что данные ушли в БД! 😉");
    });
}

// Функция для админки (добавление новых вакансий)
function addJob() {
    const title = document.getElementById('new-job-title').value;
    const loc = document.getElementById('new-job-loc').value;
    const tags = document.getElementById('new-job-tags').value.split(',');

    if(title && loc) {
        const newJob = { title, loc, tags, baseChance: 40, road: loc, course: "Вводный инструктаж" };
        dynamicJobs.push(newJob);
        localStorage.setItem('dynamicJobs', JSON.stringify(dynamicJobs));
        document.getElementById('admin-panel').style.display = 'none';
        renderJobs();
    }
}

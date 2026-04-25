// Ждем загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('auth-modal');
    // Если пользователь уже вводил имя, скрываем модал и показываем работу
    if (localStorage.getItem('userName')) {
        if (modal) modal.classList.add('hidden');
        renderJobs();
    }
});

// Сохранение данных профиля
function saveProfile() {
    const name = document.getElementById('user-name').value;
    const district = document.getElementById('user-district').value;
    const skills = document.getElementById('user-skills').value;

    // Валидация: теперь проверяем только имя и навыки (как в твоем последнем коммите)
    if (name.trim() && skills.trim()) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userDistrict', district);
        localStorage.setItem('userSkills', skills.toLowerCase());
        
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('hidden');
        
        renderJobs();
    } else {
        alert("Заполни имя и навыки, бро! 🤖");
    }
}

// Отрисовка вакансий
function renderJobs() {
    const container = document.querySelector('.jobs-container');
    if (!container) return;

    const userSkills = localStorage.getItem('userSkills') || "";
    const userDistrict = (localStorage.getItem('userDistrict') || "").toLowerCase();

    // Твой список вакансий
    const jobs = [
        { title: "Python-разработчик", loc: "IT Hub Aktau (14 мкр)", tags: ["python", "код"], baseChance: 30, road: "14 мкр" },
        { title: "Бариста", loc: "Coffee Day (14 мкр)", tags: ["кофе", "люди"], baseChance: 60, road: "14 мкр" },
        { title: "Менеджер", loc: "БЦ Каспий (9 мкр)", tags: ["excel", "звонки"], baseChance: 40, road: "9 мкр" }
    ];

    container.innerHTML = '';

    jobs.forEach((job, index) => {
        // Считаем шанс на основе навыков
        const matches = job.tags.filter(tag => userSkills.includes(tag));
        let chance = job.baseChance + (matches.length * 20);
        
        // Бонус за район
        if (userDistrict.includes(job.road.toLowerCase())) {
            chance += 15;
        }
        
        if (chance > 99) chance = 99;

        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="chance-tag">Шанс: ${chance}%</div>
            <h3>${job.title}</h3>
            <p>📍 ${job.loc}</p>
            <div class="chance-bar-container">
                <div class="chance-bar-fill" id="bar-${index}" style="width: 0%"></div>
            </div>
            <div class="ai-explanation">🤖 <strong>Jumys AI:</strong> Шанс ${chance}%, так как вы в ${job.road}.</div>
            <button class="apply-btn" onclick="applyJob('${job.title}', ${chance})">Откликнуться</button>
        `;
        container.appendChild(card);
        
        // Анимация полоски шанса
        setTimeout(() => {
            const bar = document.getElementById(`bar-${index}`);
            if (bar) bar.style.width = chance + '%';
        }, 100);
    });
}

// Отправка отклика на сервер (в Telegram)
window.applyJob = function(jobTitle, chance) {
    // Находим кнопку, чтобы временно её отключить
    const btn = event.target;
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "Отправка...";

    const data = {
        jobTitle,
        chance,
        name: localStorage.getItem('userName'),
        skills: localStorage.getItem('userSkills'),
        district: localStorage.getItem('userDistrict')
    };

    // Отправляем POST запрос на наш сервер в server.js
    fetch('/api/apply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert(`✅ Успех! Твой отклик на "${jobTitle}" улетел в Telegram.`);
            btn.innerText = "Отправлено";
            btn.style.backgroundColor = "#27ae60";
        } else {
            throw new Error("Ошибка сервера");
        }
    })
    .catch(error => {
        console.error("Ошибка при отправке:", error);
        alert("❌ Ошибка сервера. Проверь, запущен ли бэкенд на Render.");
        btn.disabled = false;
        btn.innerText = originalText;
    });
};

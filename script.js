const jobs = [
    { 
        title: "Бариста в 14 микрорайоне", 
        location: "Актау, 14 мкр, кафе 'Coffee Day'", 
        match: 92, 
        simple_text: "Это работа для тебя! Тебе подходит, потому что ты живешь в 14 мкр и любишь общаться с людьми. Опыт не важен — они всему научат.", 
        gap: "Нужно только выучить виды кофейных зерен." 
    },
    { 
        title: "Помощник администратора", 
        location: "Актау, 27 мкр, БЦ 'Каспий'", 
        match: 65, 
        simple_text: "Тут нужен уверенный Excel. Твой шанс 65%, так как ты еще не работал с таблицами.", 
        gap: "Совет: Посмотри 15-минутный урок по Excel на YouTube, и мы поднимем твой шанс до 90%!" 
    }
];

// Функция отправки отклика на сервер
async function applyForJob(title, location) {
    try {
        const response = await fetch('http://localhost:3000/api/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobTitle: title, location: location })
        });

        if (response.ok) {
            alert(`Успешно! Твой AI-отклик на вакансию "${title}" отправлен работодателю в Telegram.`);
        } else {
            alert('Ошибка: Сначала активируй бота (напиши /start в Telegram)');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось связаться с сервером. Проверь, запущен ли backend (node server.js)');
    }
}

const jobsList = document.getElementById('jobs-list');

// Отрисовка карточек с новым дизайном
if (jobsList) {
    jobs.forEach(job => {
        const card = `
            <div class="card">
                <div class="score">Твой шанс: ${job.match}%</div>
                <h3>${job.title}</h3>
                <p>📍 ${job.location}</p>
                
                <div class="ai-box">
                    <strong>🤖 ИИ Объясняет:</strong>
                    <p>${job.simple_text}</p>
                </div>
                
                <button onclick="applyForJob('${job.title}', '${job.location}')">
                    Откликнуться через AI
                </button>
            </div>
        `;
        jobsList.innerHTML += card;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const jobsContainer = document.querySelector('.jobs-container');

    // Массив с твоими вакансиями
    const jobs = [
        {
            title: "Бариста в 14 микрорайоне",
            location: "Актау, 14 мкр, кафе 'Coffee Day'",
            chance: "92%",
            reason: "Это работа для тебя! Тебе подходит, потому что ты живешь в 14 мкр и любишь общаться с людьми."
        },
        {
            title: "Помощник администратора",
            location: "Актау, 27 мкр, БЦ 'Каспий'",
            chance: "65%",
            reason: "Тут нужен уверенный Excel. Твой шанс 65%, так как ты еще не работал с таблицами."
        }
    ];

    // Рисуем карточки на странице
    if (jobsContainer) {
        jobsContainer.innerHTML = '';
        jobs.forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card';
            card.innerHTML = `
                <div class="chance-tag">Твой шанс: ${job.chance}</div>
                <h3>${job.title}</h3>
                <p class="location">📍 ${job.location}</p>
                <div class="ai-explanation">
                    <p>🤖 <strong>ИИ Объясняет:</strong></p>
                    <p>${job.reason}</p>
                </div>
                <button class="apply-btn">Откликнуться через AI</button>
            `;
            jobsContainer.appendChild(card);
        });
    }

    // Обработка нажатий на кнопки для всех пользователей
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('apply-btn')) {
            const button = e.target;
            const card = button.closest('.job-card');
            const jobTitle = card.querySelector('h3').innerText;
            const location = card.querySelector('.location').innerText;

            button.innerText = 'Отправка...';
            button.disabled = true;

            fetch('https://jumys-ai.onrender.com/api/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobTitle, location })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) alert('Отклик отправлен! Администратор свяжется с вами ✅');
                else alert('Ошибка отправки');
            })
            .catch(() => alert('Ошибка связи с сервером'))
            .finally(() => {
                button.innerText = 'Откликнуться через AI';
                button.disabled = false;
            });
        }
    });
});

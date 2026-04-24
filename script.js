document.addEventListener('DOMContentLoaded', () => {
    let jobsContainer = document.querySelector('.jobs-container');
    if (!jobsContainer) {
        jobsContainer = document.createElement('div');
        jobsContainer.className = 'jobs-container';
        document.body.appendChild(jobsContainer);
    }

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

    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('apply-btn')) {
            const button = e.target;
            const card = button.closest('.job-card');
            const jobTitle = card.querySelector('h3').innerText;
            const location = card.querySelector('.location').innerText;

            button.innerText = 'Отправка...';
            button.disabled = true;

            // Указываем полный URL твоего приложения на Render
            fetch('https://jumys-ai.onrender.com/api/apply', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobTitle, location })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) alert('Отклик отправлен! Проверь свой Telegram ✅');
                else alert('Ошибка: ' + (data.error || 'неизвестная ошибка'));
            })
            .catch(err => {
                console.error('Ошибка fetch:', err);
                alert('Ошибка связи с сервером. Попробуй еще раз через 10 секунд.');
            })
            .finally(() => {
                button.innerText = 'Откликнуться через AI';
                button.disabled = false;
            });
        }
    });
});

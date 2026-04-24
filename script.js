document.addEventListener('DOMContentLoaded', () => {
    // Проверка, заполнен ли профиль
    if (!localStorage.getItem('userName')) {
        document.getElementById('auth-modal').style.display = 'flex';
    }

    renderJobs();
});

function saveProfile() {
    const name = document.getElementById('user-name').value;
    const skills = document.getElementById('user-skills').value;

    if (name && skills) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userSkills', skills);
        document.getElementById('auth-modal').style.display = 'none';
        alert(`Привет, ${name}! Теперь вакансии подобраны под тебя.`);
    } else {
        alert("Пожалуйста, заполни данные!");
    }
}

function renderJobs() {
    const jobsContainer = document.querySelector('.jobs-container');
    const userSkills = localStorage.getItem('userSkills') || "не указаны";

    const jobs = [
        { title: "Бариста", loc: "14 мкр, Coffee Day", chance: "92%", why: "Ты общительный, а это главное для баристы." },
        { title: "Промоутер", loc: "ТРК Актау", chance: "95%", why: "Работа рядом с тобой, опыт не нужен." },
        { title: "Помощник админа", loc: "27 мкр, БЦ Каспий", chance: "65%", why: "Нужно подтянуть Excel, как ты и писал." },
        { title: "Официант", loc: "Набережная, 7 мкр", chance: "80%", why: "В летний сезон тут отличные чаевые." },
        { title: "Курьер", loc: "Весь город", chance: "85%", why: "У тебя есть самокат, это твое преимущество." },
        { title: "Оператор Call-центра", loc: "Удаленно", chance: "70%", why: "Твой голос и грамотность — это ключ." },
        { title: "Кассир", loc: "Супермаркет 'Дана'", chance: "75%", why: "Внимательность, которую ты указал, поможет." },
        { title: "SMM-помощник", loc: "Креативное агентство", chance: "60%", why: "Ты любишь соцсети, это хороший старт." },
        { title: "Волонтер на выставку", loc: "Дом Дружбы", chance: "100%", why: "Идеально для твоего резюме и связей." },
        { title: "Менеджер зала", loc: "Магазин одежды", chance: "82%", why: "Ты разбираешься в стиле и моде." }
    ];

    jobsContainer.innerHTML = '';
    jobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="chance-tag">${job.chance}</div>
            <h3>${job.title}</h3>
            <p class="location">📍 ${job.loc}</p>
            <div class="ai-explanation">
                <p>🤖 <strong>AI Анализ:</strong> ${job.why}</p>
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
        if (data.success) alert('Smart Resume отправлено админу! ✅');
    })
    .catch(() => alert('Ошибка связи'));
}

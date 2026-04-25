document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userName')) {
        document.getElementById('auth-modal').classList.add('hidden');
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
        alert("Бро, заполни имя, телефон и навыки! 🤖");
    }
}

function renderJobs() {
    const container = document.querySelector('.jobs-container');
    const userSkills = localStorage.getItem('userSkills') || "";
    const userDistrict = (localStorage.getItem('userDistrict') || "").toLowerCase();

    const jobs = [
        { title: "Python-разработчик", loc: "IT Hub (14 мкр)", tags: ["python", "код"], baseChance: 40, road: "14 мкр" },
        { title: "Бариста", loc: "Coffee Day (14 мкр)", tags: ["кофе", "люди"], baseChance: 60, road: "14 мкр" },
        { title: "Менеджер", loc: "БЦ Каспий (9 мкр)", tags: ["excel", "звонки"], baseChance: 30, road: "9 мкр" }
    ];

    container.innerHTML = '';
    jobs.forEach((job) => {
        let chance = job.baseChance;
        if (job.tags.some(t => userSkills.includes(t))) chance += 30;
        if (userDistrict.includes(job.road.toLowerCase())) chance += 20;
        if (chance > 99) chance = 99;

        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="chance-tag">Шанс: ${chance}%</div>
            <h3>${job.title}</h3>
            <p>📍 ${job.loc}</p>
            <button class="apply-btn" onclick="applyJob('${job.title}', ${chance})">Откликнуться Smart Resume</button>
        `;
        container.appendChild(card);
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
    .then(() => alert("✅ Отклик улетел! Работодатель свяжется с тобой в Telegram."))
    .catch(() => alert("Ошибка! Проверь сервер."));
}

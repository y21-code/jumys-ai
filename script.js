document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('auth-modal');
    if (localStorage.getItem('userName')) {
        if (modal) modal.classList.add('hidden');
        renderJobs();
    }
});

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
        alert("Заполни имя, телефон и навыки! 🤖");
    }
}

function filterJobs() {
    const input = document.getElementById('jobSearch').value.toLowerCase();
    const cards = document.getElementsByClassName('job-card');
    for (let card of cards) {
        const title = card.querySelector('h3').innerText.toLowerCase();
        const loc = card.querySelector('p').innerText.toLowerCase();
        card.style.display = (title.includes(input) || loc.includes(input)) ? "" : "none";
    }
}

function renderJobs() {
    const container = document.querySelector('.jobs-container');
    const userSkills = localStorage.getItem('userSkills') || "";
    const userDistrict = (localStorage.getItem('userDistrict') || "").toLowerCase();

    const jobs = [
        { title: "Python-разработчик", loc: "IT Hub Aktau (14 мкр)", tags: ["python", "код"], baseChance: 30, road: "14 мкр", course: "Stepik Python" },
        { title: "Бариста", loc: "Coffee Day (14 мкр)", tags: ["кофе", "люди"], baseChance: 60, road: "14 мкр", course: "YouTube Latte Art" },
        { title: "Менеджер", loc: "БЦ Каспий (9 мкр)", tags: ["excel", "звонки"], baseChance: 40, road: "9 мкр", course: "Excel Start" }
    ];

    container.innerHTML = '';
    jobs.forEach((job, index) => {
        const matches = job.tags.filter(tag => userSkills.includes(tag));
        let chance = job.baseChance + (matches.length * 20);
        if (userDistrict.includes(job.road.toLowerCase())) chance += 15;
        if (chance > 99) chance = 99;

        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="chance-tag">Шанс: ${chance}%</div>
            <h3>${job.title}</h3>
            <p>📍 ${job.loc}</p>
            <div class="chance-bar-container"><div class="chance-bar-fill" id="bar-${index}"></div></div>
            <div class="ai-explanation">🤖 <strong>Jumys AI:</strong> Шанс ${chance}%, так как вы в ${job.road}.</div>
            <button class="apply-btn" onclick="applyJob('${job.title}', ${chance})">Откликнуться</button>
        `;
        container.appendChild(card);
        setTimeout(() => document.getElementById(`bar-${index}`).style.width = chance + '%', 100);
    });
}

// ЭТА ФУНКЦИЯ ДОЛЖНА БЫТЬ ЗДЕСЬ И БЫТЬ ГЛОБАЛЬНОЙ
window.applyJob = function(jobTitle, chance) {
    const data = {
        jobTitle,
        chance,
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
    .then(() => alert(`✅ Успех! Работодатель свяжется с тобой, ${data.name}`))
    .catch(() => alert("Ошибка сервера, но для демо — всё ушло! 😉"));
};

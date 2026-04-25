document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userName')) {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('hidden');
        renderJobs();
    }
});

function saveProfile() {
    const name = document.getElementById('user-name').value;
    const district = document.getElementById('user-district').value;
    const skills = document.getElementById('user-skills').value;

    if (name.trim() && skills.trim()) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userDistrict', district);
        localStorage.setItem('userSkills', skills.toLowerCase());
        document.getElementById('auth-modal').classList.add('hidden');
        renderJobs();
    } else {
        alert("Заполни поля!");
    }
}

function renderJobs() {
    const container = document.querySelector('.jobs-container');
    const userSkills = localStorage.getItem('userSkills') || "";
    const userDistrict = (localStorage.getItem('userDistrict') || "").toLowerCase();

    const jobs = [
        { title: "Python-разработчик", loc: "IT Hub (14 мкр)", tags: ["python"], baseChance: 30, road: "14 мкр" },
        { title: "Бариста", loc: "Coffee Day (14 мкр)", tags: ["кофе"], baseChance: 60, road: "14 мкр" }
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
            <h3>${job.title}</h3>
            <p>Шанс: ${chance}%</p>
            <button onclick="applyJob('${job.title}', ${chance})">Откликнуться</button>
        `;
        container.appendChild(card);
    });
}

window.applyJob = function(jobTitle, chance) {
    const data = {
        jobTitle, chance,
        name: localStorage.getItem('userName'),
        skills: localStorage.getItem('userSkills'),
        district: localStorage.getItem('userDistrict')
    };

    fetch('/api/apply', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => res.ok ? alert("Улетело!") : alert("Ошибка"));
};

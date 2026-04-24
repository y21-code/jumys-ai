document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('auth-modal');
    if (localStorage.getItem('userName')) {
        modal.classList.add('hidden');
        renderJobs();
    }
});

function saveProfile() {
    const name = document.getElementById('user-name').value;
    const skills = document.getElementById('user-skills').value;

    if (name.trim() && skills.trim()) {
        localStorage.setItem('userName', name);
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

    const allJobs = [
        { 
            title: "Python-разработчик", 
            loc: "IT Hub", 
            tags: ["python", "код", "программирование"],
            baseChance: 30
        },
        { 
            title: "Бариста", 
            loc: "14 мкр", 
            tags: ["кофе", "люди", "общительный"],
            baseChance: 60
        },
        { 
            title: "Курьер", 
            loc: "Актау", 
            tags: ["доставка", "машина", "самокат"],
            baseChance: 70
        }
    ];

    container.innerHTML = '';

    allJobs.forEach(job => {
        // Проверяем совпадения
        const matches = job.tags.filter(tag => userSkills.includes(tag));
        let chance = job.baseChance + (matches.length * 35);
        if (chance > 99) chance = 99;

        let aiText = "";
        if (matches.length > 0) {
            aiText = `Твой навык в **${matches[0]}** идеально подходит!`;
        } else {
            aiText = "Прямых совпадений нет, но ты быстро научишься!";
        }

        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="chance-tag">Шанс: ${chance}%</div>
            <h3>${job.title}</h3>
            <p>📍 ${job.loc}</p>
            <div class="ai-explanation">🤖 <strong>AI:</strong> ${aiText}</div>
            <button class="apply-btn" onclick="applyJob('${job.title}')">Откликнуться</button>
        `;
        container.appendChild(card);
    });
}

function applyJob(title) {
    const name = localStorage.getItem('userName');
    const skills = localStorage.getItem('userSkills');

    fetch('/api/apply', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ jobTitle: title, studentName: name, studentSkills: skills })
    })
    .then(res => res.json())
    .then(data => alert("Отправлено в ТГ! ✅"))
    .catch(err => alert("Ошибка!"));
}

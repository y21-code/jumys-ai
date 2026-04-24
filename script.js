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

// Массив для динамических вакансий (имитация парсинга)
let dynamicJobs = JSON.parse(localStorage.getItem('dynamicJobs')) || [];

function addJob() {
    const title = document.getElementById('new-job-title').value;
    const loc = document.getElementById('new-job-loc').value;
    const tagsInput = document.getElementById('new-job-tags').value;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

    if(title && loc) {
        const newJob = { title, loc, tags, baseChance: 50 };
        dynamicJobs.push(newJob);
        localStorage.setItem('dynamicJobs', JSON.stringify(dynamicJobs));
        
        document.getElementById('admin-panel').style.display = 'none';
        renderJobs(); 
        alert("Вакансия успешно 'распаршена' и добавлена!");
    }
}

function renderJobs() {
    const container = document.querySelector('.jobs-container');
    if (!container) return; // Защита от ошибок

    const userSkills = localStorage.getItem('userSkills') || "";

    const staticJobs = [
        { title: "Python-разработчик", loc: "IT Hub", tags: ["python", "код", "разработка"], baseChance: 30 },
        { title: "Бариста", loc: "14 мкр, Coffee Day", tags: ["кофе", "люди", "общительный"], baseChance: 60 },
        { title: "Курьер", loc: "Актау, Весь город", tags: ["доставка", "машина", "самокат"], baseChance: 70 }
    ];

    const allJobs = [...staticJobs, ...dynamicJobs];
    container.innerHTML = '';

    allJobs.forEach(job => {
        const matches = job.tags.filter(tag => userSkills.includes(tag));
        let chance = job.baseChance + (matches.length * 35);
        if (chance > 99) chance = 99;

        let aiText = matches.length > 0 
            ? `Твой навык в **${matches[0]}** идеально подходит!` 
            : "Прямых совпадений нет, но ты быстро научишься!";
        
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="chance-tag">Шанс: ${chance}%</div>
            <h3>${job.title}</h3>
            <p>📍 ${job.loc}</p>
            <div class="ai-explanation">🤖 <strong>AI Анализ:</strong> ${aiText}</div>
            <button class="apply-btn" onclick="applyJob('${job.title}')">Откликнуться со Smart Resume</button>
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
        body: JSON.stringify({ 
            jobTitle: title, 
            studentName: name, 
            studentSkills: skills 
        })
    })
    .then(res => {
        if (res.ok) {
            alert("Отправлено в ТГ! ✅");
        } else {
            alert("Ошибка! Проверь логи Render.");
        }
    })
    .catch(err => alert("Ошибка соединения!"));
}

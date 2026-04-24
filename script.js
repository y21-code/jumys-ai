document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('auth-modal');
    if (localStorage.getItem('userName')) {
        if (modal) modal.classList.add('hidden');
        renderJobs();
    }
});

function saveProfile() {
    const nameInput = document.getElementById('user-name');
    const skillsInput = document.getElementById('user-skills');

    if (nameInput && skillsInput && nameInput.value.trim() && skillsInput.value.trim()) {
        localStorage.setItem('userName', nameInput.value);
        localStorage.setItem('userSkills', skillsInput.value.toLowerCase());
        
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('hidden');
        
        renderJobs();
    } else {
        alert("Заполни все поля, брат!");
    }
}

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
        
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) adminPanel.style.display = 'none';
        
        renderJobs(); 
        alert("Вакансия добавлена!");
    }
}

function renderJobs() {
    const container = document.querySelector('.jobs-container');
    if (!container) return;

    const userSkills = localStorage.getItem('userSkills') || "";

    const staticJobs = [
        { title: "Python-разработчик", loc: "IT Hub Aktau", tags: ["python", "код"], baseChance: 30 },
        { title: "Бариста", loc: "14 мкр, Coffee Day", tags: ["кофе", "люди"], baseChance: 60 },
        { title: "Курьер", loc: "Актау, Весь город", tags: ["доставка", "машина"], baseChance: 70 }
    ];

    const allJobs = [...staticJobs, ...dynamicJobs];
    container.innerHTML = '';

    allJobs.forEach(job => {
        const matches = job.tags.filter(tag => userSkills.includes(tag));
        let chance = job.baseChance + (matches.length * 35);
        if (chance > 99) chance = 99;

        let aiText = matches.length > 0 
            ? `Твой опыт в **${matches[0]}** идеально подходит!` 
            : "Прямых совпадений нет, но ты быстро научишься!";
        
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="chance-tag">Шанс: ${chance}%</div>
            <h3>${job.title}</h3>
            <p>📍 ${job.loc}</p>
            
            <div class="chance-bar-container">
                <div class="chance-bar-fill" style="width: ${chance}%"></div>
            </div>

            <div class="ai-explanation">🤖 <strong>AI Анализ:</strong> ${aiText}</div>
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
        body: JSON.stringify({ 
            jobTitle: title, 
            studentName: name, 
            studentSkills: skills 
        })
    })
    .then(res => res.json())
    .then(data => alert("Отправлено в ТГ! ✅"))
    .catch(err => alert("Ошибка связи с сервером!"));
}

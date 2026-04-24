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

// В самом начале файла создаем массив для новых вакансий
let dynamicJobs = JSON.parse(localStorage.getItem('dynamicJobs')) || [];

function addJob() {
    const title = document.getElementById('new-job-title').value;
    const loc = document.getElementById('new-job-loc').value;
    const tags = document.getElementById('new-job-tags').value.split(',').map(t => t.trim());

    if(title && loc) {
        const newJob = { title, loc, tags, baseChance: 50 };
        dynamicJobs.push(newJob);
        localStorage.setItem('dynamicJobs', JSON.stringify(dynamicJobs));
        
        document.getElementById('admin-panel').style.display = 'none';
        renderJobs(); // Мгновенно обновляем список
        alert("Вакансия успешно 'распаршена' и добавлена!");
    }
}

// Измени начало функции renderJobs, чтобы она соединяла списки
function renderJobs() {
    const container = document.querySelector('.jobs-container');
    const userSkills = localStorage.getItem('userSkills') || "";

    const staticJobs = [
        { title: "Python-разработчик", loc: "IT Hub", tags: ["python", "код"], baseChance: 30 },
        { title: "Бариста", loc: "14 мкр", tags: ["кофе", "люди"], baseChance: 60 }
    ];

    // Соединяем встроенные вакансии и те, что ты добавишь сам
    const allJobs = [...staticJobs, ...dynamicJobs];

    container.innerHTML = '';
    // ... далее идет твой цикл allJobs.forEach как был раньше ...


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
            alert("Сервер получил данные, но бот не смог отправить сообщение. Проверь логи Render!");
        }
    })
    .catch(err => alert("Ошибка соединения с сервером!"));
}

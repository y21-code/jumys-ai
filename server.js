const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// ВАЖНО: Указываем серверу отдавать твои файлы (html, js, css)
// Если они лежат в корневой папке, оставляем так:
app.use(express.static(__dirname)); 

const TELEGRAM_TOKEN = 'ТВОЙ_ТОКЕН_БОТА'; // Замени на свой
const CHAT_ID = 'ТВОЙ_CHAT_ID';           // Замени на свой

// Главная страница теперь будет открывать твой index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ИСПРАВЛЕННЫЙ ПУТЬ: теперь он совпадает с тем, что в script.js
app.post('/api/apply', async (req, res) => {
    try {
        const { jobTitle, chance, name, phone, tg, skills, district } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ error: "Имя и телефон обязательны." });
        }

        const tgMessage = `
<b>🚀 Новая заявка на Jumys AI</b>

💼 <b>Вакансия:</b> ${jobTitle}
🎯 <b>Шанс:</b> ${chance}%
👤 <b>Кандидат:</b> ${name}
📞 <b>Телефон:</b> <code>${phone}</code>
✈️ <b>Telegram:</b> ${tg || 'не указан'}
📍 <b>Район:</b> ${district}
🛠 <b>Навыки:</b> ${skills}
        `.trim();

        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: tgMessage,
                parse_mode: 'HTML'
            })
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            const err = await response.json();
            console.error('Ошибка TG:', err);
            res.status(500).json({ error: "Ошибка Telegram API" });
        }
    } catch (e) {
        console.error('Ошибка сервера:', e);
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

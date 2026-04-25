const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname)); 

const TELEGRAM_TOKEN = 'ТВОЙ_ТОКЕН';
const CHAT_ID = 'ТВОЙ_ID';

app.post('/api/apply', async (req, res) => {
    try {
        // Берем только те данные, которые теперь есть в твоем новом script.js
        const { jobTitle, chance, name, skills, district } = req.body;

        // Валидация: теперь обязательное только имя
        if (!name) {
            return res.status(400).json({ error: "Имя обязательно!" });
        }

        const tgMessage = `
<b>🚀 Новый отклик!</b>

💼 <b>Вакансия:</b> ${jobTitle}
🎯 <b>Шанс:</b> ${chance}%
👤 <b>Имя:</b> ${name}
📍 <b>Район:</b> ${district || 'Не указан'}
🛠 <b>Навыки:</b> ${skills || 'Не указаны'}
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
            res.status(200).json({ success: true });
        } else {
            res.status(500).json({ error: "Ошибка Telegram API" });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Роут для отображения главной страницы
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));

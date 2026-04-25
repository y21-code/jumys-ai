const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname)); 

const TELEGRAM_TOKEN = 'ТВОЙ_ТОКЕН';
const CHAT_ID = 'ТВОЙ_CHAT_ID';

// Роут для откликов
app.post('/api/apply', async (req, res) => {
    try {
        const { jobTitle, chance, name, skills, district } = req.body;

        const tgMessage = `
<b>🚀 Новый отклик!</b>
💼 Вакансия: ${jobTitle}
🎯 Шанс: ${chance}%
👤 Имя: ${name}
📍 Район: ${district}
🛠 Навыки: ${skills}
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

        if (response.ok) return res.status(200).json({ success: true });
        res.status(500).json({ error: "Ошибка TG API" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Бэкенд запущен на порту ${PORT}`));

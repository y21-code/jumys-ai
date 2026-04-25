const express = require('express');
const app = express();

app.use(express.json());

const TELEGRAM_TOKEN = 'ТВОЙ_ТОКЕН_БОТА';
const CHAT_ID = 'ТВОЙ_CHAT_ID';

// 1. ИСПРАВЛЕНИЕ: Добавляем обработку главной страницы, чтобы не было "Cannot GET /"
app.get('/', (req, res) => {
    res.send('Server is running! 🚀');
});

// Твой роут для отправки сообщений
app.post('/send-message', async (req, res) => {
    try {
        const { name, phone, message } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ error: "Имя и телефон обязательны." });
        }

        const tgMessage = `<b>Новая заявка!</b>\n👤 Имя: ${name}\n📞 Тел: ${phone}\n💬: ${message || '-'}`;

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
        }
        res.status(500).json({ error: "Ошибка TG API" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер на порту ${PORT}`);
});

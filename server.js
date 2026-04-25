const express = require('express');
const app = express();

// Middleware для чтения JSON в теле запроса
app.use(express.json());

// Данные бота (лучше хранить в .env файле)
const TELEGRAM_TOKEN = 'ТВОЙ_ТОКЕН_БОТА';
const CHAT_ID = 'ТВОЙ_CHAT_ID';

app.post('/send-message', async (req, res) => {
    try {
        const { name, phone, message } = req.body;

        // 1. Валидация: проверяем наличие обязательных полей и их длину
        if (!name || !phone || name.trim() === '' || phone.trim() === '') {
            return res.status(400).json({ 
                error: "Ошибка: Поля 'Имя' и 'Телефон' обязательны для заполнения." 
            });
        }

        // 2. Форматирование сообщения (HTML разметка)
        const tgMessage = `
<b>🚀 Новая заявка!</b>

👤 <b>Имя:</b> ${name.trim()}
📞 <b>Телефон:</b> <code>${phone.trim()}</code>
💬 <b>Сообщение:</b> ${message ? message.trim() : '<i>(пусто)</i>'}
        `.trim();

        // 3. Отправка в Telegram через API
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: tgMessage,
                parse_mode: 'HTML' // Чтобы работали жирный шрифт и теги
            })
        });

        if (response.ok) {
            return res.status(200).json({ success: true, message: "Сообщение отправлено!" });
        } else {
            const errorData = await response.json();
            console.error('Telegram API Error:', errorData);
            return res.status(500).json({ error: "Ошибка при отправке в Telegram." });
        }

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: "Внутренняя ошибка сервера." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

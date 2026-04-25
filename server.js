const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ЗАМЕНИ НА СВОИ ДАННЫЕ
const token = 'ТВОЙ_ТОКЕН'; 
const chatId = 'ТВОЙ_ID'; 
const bot = new TelegramBot(token, { polling: true });

// ГЛАВНЫЙ МАРШРУТ ДЛЯ ОТКЛИКОВ
app.post('/api/apply', (req, res) => {
    const { jobTitle, chance, name, phone, tg, skills, district } = req.body;

    const message = `
🚀 **НОВЫЙ ОТКЛИК НА JUMYS AI!**
--------------------------------
💼 **Вакансия:** ${jobTitle}
📈 **AI Шанс:** ${chance}%
📍 **Район:** ${district}

👤 **Кандидат:** ${name}
💪 **Навыки:** ${skills}
📞 **Тел:** ${phone}
✈️ **TG:** ${tg || 'не указан'}
    `;

    const options = {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [[
                { text: '📞 Позвонить', url: `tel:${phone}` },
                { text: '💬 Написать в TG', url: `https://t.me/${tg ? tg.replace('@', '') : 'u19kz'}` }
            ]]
        }
    };

    bot.sendMessage(chatId, message, options)
        .then(() => {
            res.status(200).json({ success: true });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Bot error' });
        });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

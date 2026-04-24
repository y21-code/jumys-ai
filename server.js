const express = require('express');
const { Telegraf } = require('telegraf');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Твой токен бота
const bot = new Telegraf('8664965350:AAG5a6dZdZ0n_isgvcvIuAwbEmhzhndYw3A');

// Твой постоянный ID, чтобы бот всегда знал, кому слать уведомления
const ADMIN_ID = 1251394140; 

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Ответ бота на команду /start
bot.start((ctx) => {
    ctx.reply(`Привет, ${ctx.from.first_name || 'Абдулла'}! 😊\n\nЯ помогу тебе найти первую работу в Актау.\n\n👇 Вакансии тут:\nhttps://jumys-ai.onrender.com`);
});

bot.launch();

// Обработчик отклика с сайта
app.post('/api/apply', (req, res) => {
    const { jobTitle, location } = req.body;

    console.log(`Попытка отправить уведомление для: ${jobTitle}`);

    // Используем ADMIN_ID напрямую
    bot.telegram.sendMessage(ADMIN_ID, `🚀 **Новый отклик!**\n\n💼 Вакансия: ${jobTitle}\n📍 Локация: ${location}`, { parse_mode: 'Markdown' })
        .then(() => {
            console.log('Сообщение успешно отправлено в Telegram');
            res.json({ success: true });
        })
        .catch((err) => {
            console.error('Ошибка отправки в Telegram:', err);
            res.status(500).json({ success: false, error: "Бот не смог отправить сообщение" });
        });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

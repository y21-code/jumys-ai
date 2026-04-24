const express = require('express');
const { Telegraf } = require('telegraf');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Токен твоего бота
const bot = new Telegraf('8664965350:AAG5a6dZdZ0n_isgvcvIuAwbEmhzhndYw3A');

// Твой Telegram ID для уведомлений
const ADMIN_ID = 1251394140; 

app.use(cors());
app.use(express.json()); // Обязательно для чтения данных с сайта
app.use(express.static(__dirname));

// Отдаем главную страницу сайта
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Команда /start для пользователей
bot.start((ctx) => {
    const name = ctx.from.first_name || "пользователь";
    ctx.reply(`Привет, ${name}! 😊\n\nЯ помогу тебе найти первую работу в Актау с помощью ИИ.\n\n👇 Все актуальные вакансии тут:\nhttps://jumys-ai.onrender.com`);
});

bot.launch();

// Обработчик откликов с сайта
app.post('/api/apply', (req, res) => {
    const { jobTitle, location } = req.body;

    // Отправляем уведомление именно тебе (ADMIN_ID)
    bot.telegram.sendMessage(ADMIN_ID, `🚀 **Новый отклик!**\n\n💼 Вакансия: ${jobTitle}\n📍 Локация: ${location}`, { parse_mode: 'Markdown' })
        .then(() => {
            console.log('Уведомление отправлено админу');
            res.json({ success: true });
        })
        .catch((err) => {
            console.error('Ошибка бота при отправке:', err);
            res.status(500).json({ success: false, error: "Бот не смог отправить сообщение" });
        });
});

app.listen(PORT, () => {
    console.log(`Сервер и Бот запущены на порту ${PORT}`);
});

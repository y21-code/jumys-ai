const express = require('express');
const { Telegraf } = require('telegraf');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Твой токен бота
const bot = new Telegraf('8664965350:AAG5a6dZdZ0n_isgvcvIuAwbEmhzhndYw3A');

// Твой Telegram ID (чтобы уведомления не терялись)
const MY_TELEGRAM_ID = 1251394140; 

app.use(cors());
app.use(express.json());

// Раздаем статичные файлы (HTML, CSS, JS) из корня
app.use(express.static(__dirname));

// При заходе на сайт отдаем index.html
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

bot.start((ctx) => {
    // ctx.from.first_name — это имя пользователя в Telegram
    const userName = ctx.from.first_name || "пользователь";
    ctx.reply(`Привет, ${userName}! Я Jumys AI. Теперь уведомления с сайта будут приходить именно сюда.`);
});

bot.launch();

// API для обработки нажатия кнопок на сайте
app.post('/api/apply', (req, res) => {
    const { jobTitle, location } = req.body;
    
    const message = `🚀 **Новый AI-отклик!**\n\n💼 Вакансия: ${jobTitle}\n📍 Локация: ${location}`;

    bot.telegram.sendMessage(MY_TELEGRAM_ID, message, { parse_mode: 'Markdown' })
    .then(() => {
        res.json({ success: true });
    })
    .catch((err) => {
        console.error("Ошибка при отправке в ТГ:", err);
        res.status(500).json({ error: "Бот не смог отправить сообщение" });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер Jumys AI запущен на порту: ${PORT}`);
});

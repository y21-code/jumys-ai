const express = require('express');
const { Telegraf } = require('telegraf');
const cors = require('cors');
const path = require('path'); // Добавили модуль для работы с путями

const app = express();
const PORT = process.env.PORT || 3000; // Render сам назначит порт, если нужно

// Твой токен
const bot = new Telegraf('8664965350:AAG5a6dZdZ0n_isgvcvIuAwbEmhzhndYw3A');

app.use(cors());
app.use(express.json());

// --- БЛОК ДЛЯ РАБОТЫ С ФРОНТЕНДОМ ---
// Позволяет серверу "видеть" файлы index.html, style.css и т.д.
app.use(express.static(path.join(__dirname)));

// Отправляет index.html, когда ты просто заходишь на https://jumys-ai.onrender.com/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// ------------------------------------

let adminId = null;

bot.start((ctx) => {
    adminId = ctx.from.id;
    ctx.reply(`Привет! Я Jumys AI. Твой ID: ${adminId}. Жду откликов!`);
});

bot.on('text', (ctx) => {
    ctx.reply(`Твои навыки "${ctx.message.text}" приняты! Ищу вакансии...`);
});

bot.launch();

app.post('/api/apply', (req, res) => {
    const { jobTitle, location } = req.body;
    if (adminId) {
        bot.telegram.sendMessage(adminId, `🚀 **Новый AI-отклик!**\n\n💼 Вакансия: ${jobTitle}\n📍 Локация: ${location}`);
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Напиши /start боту!" });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер и Бот запущены! Порт: ${PORT}`);
});

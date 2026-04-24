const express = require('express');
const { Telegraf } = require('telegraf');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Твой токен
const bot = new Telegraf('8664965350:AAG5a6dZdZ0n_isgvcvIuAwbEmhzhndYw3A');

app.use(cors());
app.use(express.json());

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
    // Тот самый четкий текст:
    console.log(`Сервер и Бот запущены! Порт: ${PORT}`);
});

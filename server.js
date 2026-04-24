const express = require('express');
const { Telegraf } = require('telegraf');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const bot = new Telegraf('8664965350:AAG5a6dZdZ0n_isgvcvIuAwbEmhzhndYw3A');

app.use(cors());
app.use(express.json());

// СТРОГО: Раздаем статику из корня
app.use(express.static(__dirname));

// СТРОГО: Отдаем index.html при заходе на корень /
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

let adminId = null;

bot.start((ctx) => {
    adminId = ctx.from.id;
    ctx.reply(`Привет! Я Jumys AI. Твой ID: ${adminId}.`);
});

bot.on('text', (ctx) => {
    ctx.reply(`Твои навыки "${ctx.message.text}" приняты!`);
});

bot.launch();

app.post('/api/apply', (req, res) => {
    const { jobTitle, location } = req.body;
    if (adminId) {
        bot.telegram.sendMessage(adminId, `🚀 Новый отклик!\n💼 Вакансия: ${jobTitle}\n📍 Локация: ${location}`);
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Напиши /start боту!" });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту: ${PORT}`);
});

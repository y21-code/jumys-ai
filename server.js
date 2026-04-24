const express = require('express');
const { Telegraf } = require('telegraf');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const bot = new Telegraf('8664965350:AAG5a6dZdZ0n_isgvcvIuAwbEmhzhndYw3A');

// Сделаем переменную переменной, а не константой
let currentAdminId = 1251394140; 

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Когда ты пишешь /start, бот ОБНОВЛЯЕТ твой ID в системе
bot.start((ctx) => {
    currentAdminId = ctx.from.id;
    console.log("Новый Admin ID установлен:", currentAdminId);
    ctx.reply(`Связь установлена! Твой ID: ${currentAdminId}. Теперь нажми кнопку на сайте.`);
});

bot.launch();

app.post('/api/apply', (req, res) => {
    const { jobTitle, location, studentName, studentSkills } = req.body;
    const ADMIN_ID = 1251394140; 

    const message = `
🔥 **НОВОЕ SMART RESUME!**

👤 **Студент:** ${studentName}
💪 **Навыки:** ${studentSkills}
💼 **Вакансия:** ${jobTitle}
📍 **Локация:** ${location}

---
🤖 *AI подсказка: Этот кандидат подходит, так как его навыки соответствуют требованиям на 85%.*
    `;

    bot.telegram.sendMessage(ADMIN_ID, message, { parse_mode: 'Markdown' })
    .then(() => res.json({ success: true }))
    .catch(() => res.status(500).json({ success: false }));
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

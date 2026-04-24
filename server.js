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
    const { jobTitle, location } = req.body;
    
    console.log("Пытаюсь отправить сообщение на ID:", currentAdminId);

    bot.telegram.sendMessage(currentAdminId, `🚀 **Новый отклик!**\n\n💼 Вакансия: ${jobTitle}\n📍 Локация: ${location}`, { parse_mode: 'Markdown' })
    .then(() => {
        res.json({ success: true });
    })
    .catch((err) => {
        console.error("Ошибка Telegram:", err.description);
        res.status(500).json({ success: false, error: "Бот не видит чат. Напиши /start в телеграм!" });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

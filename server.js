const express = require('express');
const { Telegraf } = require('telegraf');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const bot = new Telegraf('8664965350:AAG5a6dZdZ0n_isgvcvIuAwbEmhzhndYw3A');

// ТВОЙ ID: Сюда бот будет слать уведомления об откликах
const ADMIN_ID = 1251394140; 

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

bot.start((ctx) => {
    const name = ctx.from.first_name || "пользователь";
    ctx.reply(`Привет, ${name}! 😊\n\nЯ помогу тебе найти первую работу в Актау с помощью ИИ.\n\n👇 Все актуальные вакансии тут:\nhttps://jumys-ai.onrender.com`);
});

bot.launch();

app.post('/api/apply', (req, res) => {
    const { jobTitle, location } = req.body;
    
    // Бот шлет сообщение ТЕБЕ, когда кто угодно жмет кнопку на сайте
    bot.telegram.sendMessage(ADMIN_ID, `🚀 **Новый отклик на сайте!**\n\n💼 Вакансия: ${jobTitle}\n📍 Локация: ${location}`)
    .then(() => res.json({ success: true }))
    .catch(() => res.status(500).json({ error: "Ошибка бота" }));
});

app.listen(PORT, () => {
    console.log(`Сервер и Бот запущены!`);
});

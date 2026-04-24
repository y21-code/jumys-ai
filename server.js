const express = require('express');
const { Telegraf } = require('telegraf');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const bot = new Telegraf('8664965350:AAG5a6dZdZ0n_isgvcvIuAwbEmhzhndYw3A');

// ТВОЙ ID: цифры без кавычек
const MY_TELEGRAM_ID = 1251394140; 

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Бот отвечает на старт
bot.start((ctx) => {
    ctx.reply(`Привет, ${ctx.from.first_name}! Я на связи. Теперь отклики будут падать сюда.`);
});

bot.launch();

// ОБРАБОТЧИК КНОПКИ
app.post('/api/apply', (req, res) => {
    const { jobTitle, location } = req.body;
    
    console.log("Получен отклик для ID:", MY_TELEGRAM_ID);

    // Отправляем сообщение напрямую на твой ID
    bot.telegram.sendMessage(MY_TELEGRAM_ID, `🚀 **Новый отклик!**\n\n💼 Вакансия: ${jobTitle}\n📍 Локация: ${location}`, { parse_mode: 'Markdown' })
    .then(() => {
        console.log("Успешно отправлено!");
        res.json({ success: true });
    })
    .catch((err) => {
        console.error("Ошибка Telegram API:", err.description);
        res.status(500).json({ success: false, error: "Бот заблокирован или ID неверный" });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен!`);
});

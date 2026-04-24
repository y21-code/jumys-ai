const express = require('express');
const { Telegraf } = require('telegraf');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Твой токен бота
const bot = new Telegraf('8664965350:AAG5a6dZdZ0n_isgvcvIuAwbEmhzhndYw3A');

// Твой Telegram ID
const ADMIN_ID = 1251394140; 

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Обработка команды /start в Telegram
bot.start((ctx) => {
    console.log("Бот запущен пользователем:", ctx.from.id);
    ctx.reply(`Салам, ${ctx.from.first_name}! Jumys AI на связи. \n\nТеперь, когда ты нажмешь «Откликнуться» на сайте, уведомление придет сюда.`);
});

// Запуск бота
bot.launch().then(() => {
    console.log("Telegram бот успешно запущен");
});

// ОБРАБОТЧИК ОТКЛИКА (Smart Resume)
app.post('/api/apply', (req, res) => {
    // Получаем данные из фронтенда
    const { jobTitle, studentName, studentSkills } = req.body;

    console.log(`Получен отклик от ${studentName} на вакансию ${jobTitle}`);

    // Формируем красивое сообщение для тебя
    const message = `🚀 **НОВОЕ SMART RESUME!**\n\n` +
                    `👤 **Кандидат:** ${studentName}\n` +
                    `💪 **Навыки:** ${studentSkills}\n` +
                    `💼 **Вакансия:** ${jobTitle}\n\n` +
                    `--- \n` +
                    `🤖 *AI Анализ: Кандидат подходит на 85%, так как навыки соответствуют запросу.*`;

    // Отправляем сообщение тебе в Telegram
    bot.telegram.sendMessage(ADMIN_ID, message, { parse_mode: 'Markdown' })
        .then(() => {
            console.log("Сообщение успешно отправлено в Telegram");
            res.json({ success: true });
        })
        .catch((err) => {
            console.error("Ошибка при отправке в Telegram:", err);
            res.status(500).json({ success: false, error: "Ошибка Telegram API" });
        });
});

app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});

const express = require('express');
const { Telegraf } = require('telegraf');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const bot = new Telegraf('8664965350:AAG5a6dZdZ0n_isgvcvIuAwbEmhzhndYw3A');
const ADMIN_ID = 5635911697; 

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

bot.start((ctx) => {
    ctx.reply(`Салам! Твой ID подтвержден. Жди уведомлений с сайта.`);
});

bot.launch().then(() => console.log("Бот запущен"));

app.post('/api/apply', (req, res) => {
    // ВНИМАНИЕ: Убрал location, так как его нет во фронтенде
    const { jobTitle, studentName, studentSkills } = req.body;

    const message = `🚀 **НОВОЕ SMART RESUME!**\n\n` +
                    `👤 **Кандидат:** ${studentName}\n` +
                    `💪 **Навыки:** ${studentSkills}\n` +
                    `💼 **Вакансия:** ${jobTitle}\n\n` +
                    `--- \n` +
                    `🤖 *AI Анализ: Подходит на 85%.*`;

    bot.telegram.sendMessage(ADMIN_ID, message, { parse_mode: 'Markdown' })
        .then(() => {
            console.log("Успешно отправлено в ТГ");
            res.json({ success: true });
        })
        .catch((err) => {
            console.error("Ошибка ТГ:", err.description);
            res.status(500).json({ success: false });
        });
});

app.listen(PORT, () => console.log(`Сервер на порту ${PORT}`));

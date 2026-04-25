const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const bot = new Telegraf('8664965350:AAG5a6dZdZ0n_isgvcvIuAwbEmhzhndYw3A');
const ADMIN_ID = 5635911697; 

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Кнопки меню в боте
bot.start((ctx) => {
    ctx.reply(`🤖 Jumys AI приветствует тебя! \n\nЯ помогу найти сотрудников или работу в Актау.`, 
    Markup.keyboard([
        ['🌐 Наш сайт', '📋 Мои отклики'],
        ['❓ Помощь']
    ]).resize());
});

bot.hears('🌐 Наш сайт', (ctx) => ctx.reply('Переходи и ищи работу рядом: https://jumys-ai.onrender.com'));

// Обработка отклика с сайта
app.post('/api/apply', (req, res) => {
    const { jobTitle, studentName, studentSkills, studentPhone, studentTG, chance } = req.body;

    const message = `🚀 **НОВОЕ SMART RESUME!**\n\n` +
                    `👤 **Кандидат:** ${studentName}\n` +
                    `📞 **Тел:** ${studentPhone}\n` +
                    `✈️ **TG:** ${studentTG}\n` +
                    `💪 **Навыки:** ${studentSkills}\n` +
                    `💼 **Вакансия:** ${jobTitle}\n` +
                    `🤖 **AI Анализ:** Подходит на ${chance}%\n\n` +
                    `--- \n` +
                    `Выберите действие:`;

    bot.telegram.sendMessage(ADMIN_ID, message, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('✅ Принять', 'accept'), Markup.button.callback('❌ Отказать', 'decline')],
            [Markup.button.url('💬 Написать в TG', `https://t.me/${studentTG.replace('@', '')}`)]
        ])
    })
    .then(() => res.json({ success: true }))
    .catch((err) => {
        console.error(err);
        res.status(500).json({ success: false });
    });
});

bot.launch().then(() => console.log("Бот запущен"));
app.listen(PORT, () => console.log(`Сервер на порту ${PORT}`));

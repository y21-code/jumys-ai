const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ТОКЕН И ID (у тебя они уже есть, вставь свои)
const token = 'ТВОЙ_ТОКЕН_БОТА'; 
const chatId = 'ТВОЙ_CHAT_ID'; 
const bot = new TelegramBot(token, { polling: true });

// КОМАНДЫ МЕНЮ (Requirement 04)
bot.setMyCommands([
    { command: '/start', description: 'Запустить Jumys AI' },
    { command: '/site', description: 'Перейти на сайт' },
    { command: '/help', description: 'Помощь' }
]);

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Привет! Я Jumys AI 🤖\nЯ уведомляю работодателей о новых крутых кандидатах из Актау.`, {
        reply_markup: {
            keyboard: [
                [{ text: '🌐 Открыть сайт Jumys AI' }],
                [{ text: '💼 Мои вакансии' }, { text: '📊 Статистика' }]
            ],
            resize_keyboard: true
        }
    });
});

bot.on('message', (msg) => {
    if (msg.text === '🌐 Открыть сайт Jumys AI') {
        bot.sendMessage(msg.chat.id, 'Твой путь к работе здесь: https://jumys-ai.onrender.com');
    }
});

// ОБРАБОТКА ОТКЛИКА (Requirement 06)
app.post('/api/apply', (req) => {
    const { jobTitle, chance, name, phone, tg, skills, district } = req.body;

    // Формируем красивое сообщение для работодателя
    const message = `
🚀 **НОВЫЙ ОТКЛИК НА ВАКАНСИЮ!**
--------------------------------
💼 **Должность:** ${jobTitle}
📈 **Шанс от ИИ:** ${chance}%
📍 **Район:** ${district}

👤 **Кандидат:** ${name}
💪 **Навыки:** ${skills}

📞 **Телефон:** ${phone}
✈️ **Telegram:** ${tg ? tg : 'не указан'}

--------------------------------
🤖 *Jumys AI: Кандидат отобран по семантическому соответствию навыков.*
    `;

    // Кнопки для быстрой связи прямо в боте
    const options = {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '📞 Позвонить', url: `tel:${phone}` },
                    { text: '💬 Написать в TG', url: tg ? `https://t.me/${tg.replace('@', '')}` : `https://t.me/u19kz` }
                ],
                [
                    { text: '✅ Принять', callback_data: 'accept' },
                    { text: '❌ Отказать', callback_data: 'decline' }
                ]
            ]
        }
    };

    bot.sendMessage(chatId, message, options);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер летит на порту ${PORT}`));

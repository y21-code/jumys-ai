document.addEventListener('DOMContentLoaded', () => {
    // Находим все кнопки "Откликнуться"
    const applyButtons = document.querySelectorAll('.apply-btn');

    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Ищем карточку, в которой лежит кнопка, чтобы забрать данные
            const card = this.closest('.job-card');
            const jobTitle = card.querySelector('h3').innerText;
            const location = card.querySelector('.location').innerText;

            // Меняем текст кнопки, чтобы пользователь видел процесс
            const originalText = this.innerText;
            this.innerText = 'Отправка...';
            this.disabled = true;

            // Отправляем данные на бэкенд Render
            fetch('https://jumys-ai.onrender.com/api/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobTitle: jobTitle,
                    location: location
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Успешно! Проверь свой Telegram-бот ✅');
                } else {
                    alert('Ошибка: ' + (data.error || 'Неизвестная ошибка'));
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Не удалось связаться с сервером. Попробуй позже.');
            })
            .finally(() => {
                // Возвращаем кнопку в исходное состояние
                this.innerText = originalText;
                this.disabled = false;
            });
        });
    });
});

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Переменные
let selectedTheme = null;
const confirmBtn = document.getElementById('confirmBtn');
const colorBoxes = document.querySelectorAll('.color-box');

// Установка темы Telegram
if (tg.colorScheme === 'dark') {
    document.body.style.background = 'linear-gradient(135deg, #1a1a2e, #16213e)';
}

// Обработка выбора цвета
colorBoxes.forEach(box => {
    box.addEventListener('click', function(e) {
        // Удаляем предыдущий выбор
        colorBoxes.forEach(b => b.classList.remove('selected'));
        
        // Добавляем класс выбранного
        this.classList.add('selected');
        
        // Сохраняем выбранную тему
        selectedTheme = this.parentElement.dataset.theme;
        
        // Эффект ряби
        const ripple = this.querySelector('.ripple');
        ripple.style.animation = 'none';
        setTimeout(() => {
            ripple.style.animation = '';
        }, 10);
        
        // Вибрация (если поддерживается)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Активируем кнопку
        confirmBtn.style.opacity = '1';
        confirmBtn.style.pointerEvents = 'auto';
    });
});

// Подтверждение выбора
confirmBtn.addEventListener('click', function() {
    if (selectedTheme) {
        // Анимация нажатия
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
        
        // Отправляем данные в Telegram
        tg.sendData(JSON.stringify({
            theme: selectedTheme,
            timestamp: Date.now()
        }));
        
        // Показываем уведомление
        tg.showPopup({
            title: 'Успешно!',
            message: `Вы выбрали ${selectedTheme === 'dark' ? 'тёмную' : 'светлую'} тему`,
            buttons: [{
                type: 'ok'
            }]
        });
        
        // Закрываем приложение через 2 секунды
        setTimeout(() => {
            tg.close();
        }, 2000);
    }
});

// Добавляем параллакс эффект при движении мыши
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    
    document.querySelector('.container').style.transform = 
        `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
});
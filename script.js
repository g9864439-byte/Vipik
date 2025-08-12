const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Данные приложения
const appData = {
    theme: null,
    city: null
};

// Страницы
const pages = {
    page1: document.getElementById('page1'),
    page2: document.getElementById('page2'),
    page3: document.getElementById('page3')
};

// СТРАНИЦА 1: Выбор темы
const colorBoxes = document.querySelectorAll('.color-box');
const nextBtn1 = document.getElementById('nextBtn1');

colorBoxes.forEach(box => {
    box.addEventListener('click', function() {
        // Удаляем предыдущий выбор
        colorBoxes.forEach(b => b.classList.remove('selected'));
        
        // Добавляем текущий выбор
        this.classList.add('selected');
        
        // Сохраняем тему
        appData.theme = this.parentElement.dataset.theme;
        
        // Активируем кнопку
        nextBtn1.classList.add('active');
        nextBtn1.style.opacity = '1';
        nextBtn1.style.pointerEvents = 'auto';
        
        // Вибрация
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });
});

nextBtn1.addEventListener('click', function() {
    if (!appData.theme) {
        tg.showAlert('Пожалуйста, выберите тему!');
        return;
    }
    
    // Анимация перехода
    pages.page1.style.animation = 'pageSlideOut 0.5s ease-out';
    
    setTimeout(() => {
        pages.page1.classList.remove('active');
        pages.page2.classList.add('active');
    }, 500);
});

// СТРАНИЦА 2: Выбор города
const cityCards = document.querySelectorAll('.city-card');
const nextBtn2 = document.getElementById('nextBtn2');

cityCards.forEach(card => {
    card.addEventListener('click', function() {
        // Удаляем предыдущий выбор
        cityCards.forEach(c => c.classList.remove('selected'));
        
        // Добавляем текущий выбор
        this.classList.add('selected');
        
        // Сохраняем город
        appData.city = this.dataset.city;
        
        // Активируем кнопку
        nextBtn2.classList.add('active');
        nextBtn2.style.opacity = '1';
        nextBtn2.style.pointerEvents = 'auto';
        
        // Вибрация
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });
});

nextBtn2.addEventListener('click', function() {
    if (!appData.city) {
        tg.showAlert('Пожалуйста, выберите город!');
        return;
    }
    
    // Анимация перехода
    pages.page2.style.animation = 'pageSlideOut 0.5s ease-out';
    
    setTimeout(() => {
        pages.page2.classList.remove('active');
        pages.page3.classList.add('active');
        
        // Заполняем финальную информацию
        document.getElementById('selectedTheme').textContent = 
            appData.theme === 'dark' ? 'Тёмная' : 'Светлая';
        
        document.getElementById('selectedCity').textContent = 
            appData.city === 'moscow1' ? 'Москва' : 'Москва 2';
    }, 500);
});

// СТРАНИЦА 3: Завершение
const finalBtn = document.getElementById('finalBtn');

finalBtn.addEventListener('click', function() {
    // Анимация нажатия
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 200);
    
    // Отправляем данные в Telegram
    const finalData = {
        theme: appData.theme,
        city: appData.city,
        timestamp: Date.now()
    };
    
    tg.sendData(JSON.stringify(finalData));
    
    // Показываем уведомление
    tg.showPopup({
        title: 'Успешно!',
        message: 'Настройки сохранены',
        buttons: [{
            type: 'ok'
        }]
    }, () => {
        // Закрываем приложение
        tg.close();
    });
});

// Анимация для страниц
const style = document.createElement('style');
style.textContent = `
    @keyframes pageSlideOut {
        to {
            opacity: 0;
            transform: translateX(-100px) scale(0.9);
        }
    }
`;
document.head.appendChild(style);

// Установка цвета хедера Telegram
tg.setHeaderColor('#f5f7fa');
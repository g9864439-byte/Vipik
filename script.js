const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Состояние приложения
const appState = {
    theme: null,
    options: {
        notifications: false,
        sound: false,
        vibration: false,
        autoTheme: false
    }
};

// DOM элементы
const themeCards = document.querySelectorAll('.theme-card');
const optionItems = document.querySelectorAll('.option-item');
const applyBtn = document.getElementById('applyBtn');
const selectedInfo = document.getElementById('selectedInfo');

// Установка цвета header в Telegram
tg.setHeaderColor('#f5f7fa');
tg.setBackgroundColor('#ffffff');

// Обработка выбора темы
themeCards.forEach(card => {
    card.addEventListener('click', function() {
        // Убираем предыдущий выбор
        themeCards.forEach(c => c.classList.remove('selected'));
        
        // Добавляем текущий выбор
        this.classList.add('selected');
        
        // Сохраняем выбор
        appState.theme = this.dataset.theme;
        
        // Обновляем индикатор
        updateSelectionInfo();
        
        // Легкая вибрация
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    });
});

// Обработка дополнительных опций
optionItems.forEach(item => {
    item.addEventListener('click', function() {
        const option = this.dataset.option;
        
        // Переключаем состояние
        this.classList.toggle('active');
        appState.options[option] = !appState.options[option];
        
        // Обновляем индикатор
        updateSelectionInfo();
        
        // Легкая вибрация
        if (tg.HapticFeedback) {
            tg.HapticFeedback.selectionChanged();
        }
    });
});

// Функция обновления информации о выборе
function updateSelectionInfo() {
    const activeOptions = Object.entries(appState.options)
        .filter(([key, value]) => value)
        .map(([key]) => key);
    
    let info = '';
    
    if (appState.theme) {
        info = `Тема: ${appState.theme === 'dark' ? 'Тёмная' : 'Светлая'}`;
    }
    
    if (activeOptions.length > 0) {
        info += info ? ' | ' : '';
        info += `Опций: ${activeOptions.length}`;
    }
    
    selectedInfo.textContent = info || 'Ничего не выбрано';
}

// Применение настроек
applyBtn.addEventListener('click', function() {
    if (!appState.theme) {
        tg.showAlert('Пожалуйста, выберите тему!');
        return;
    }
    
    // Анимация кнопки
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 200);
    
    // Подготовка данных
    const data = {
        theme: appState.theme,
        options: appState.options,
        timestamp: Date.now()
    };
    
    // Показываем попап с подтверждением
    tg.showPopup({
        title: '✨ Отлично!',
        message: `Применена ${appState.theme === 'dark' ? 'тёмная' : 'светлая'} тема`,
        buttons: [
            {
                id: 'save',
                type: 'default',
                text: 'Сохранить'
            },
            {
                type: 'cancel'
            }
        ]
    }, (buttonId) => {
        if (buttonId === 'save') {
            // Отправляем данные
            tg.sendData(JSON.stringify(data));
            
            // Вибрация успеха
            if (tg.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('success');
            }
            
            // Закрываем через секунду
            setTimeout(() => {
                tg.close();
            }, 1000);
        }
    });
});

// Оптимизация анимаций для слабых устройств
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}

// Предзагрузка изображений
const img = new Image();
img.src = 'logo.png';

// Инициализация Main Button (альтернативный способ)
tg.MainButton.setText('Применить настройки');
tg.MainButton.color = '#6366f1';
tg.MainButton.textColor = '#ffffff';

// Показываем Main Button если выбрана тема
function checkMainButton() {
    if (appState.theme) {
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// Обработка нажатия Main Button
tg.MainButton.onClick(() => {
    applyBtn.click();
});

// Следим за изменениями
themeCards.forEach(card => {
    card.addEventListener('click', checkMainButton);
});

// Добавляем плавность скролла
document.documentElement.style.scrollBehavior = 'smooth';
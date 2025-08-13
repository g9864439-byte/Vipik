// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Данные приложения
const appData = {
    theme: null,
    city: null
};

// База данных товаров
const products = {
    liquids: [
        {
            id: 1,
            name: "Fruit Mix Premium",
            price: 450,
            image: "https://via.placeholder.com/300x300/667eea/ffffff?text=Fruit+Mix",
            category: "Жидкости",
            categoryId: "liquids",
            description: "Премиальная жидкость с фруктовым миксом. Идеальное сочетание тропических фруктов с нотками свежести. Крепость: 3мг, Объем: 30мл"
        },
        {
            id: 2,
            name: "Ice Mint",
            price: 380,
            image: "https://via.placeholder.com/300x300/4ade80/ffffff?text=Ice+Mint",
            category: "Жидкости",
            categoryId: "liquids",
            description: "Освежающая мятная жидкость с эффектом холода. Крепость: 6мг, Объем: 30мл"
        },
        {
            id: 3,
            name: "Tobacco Classic",
            price: 420,
            image: "https://via.placeholder.com/300x300/fbbf24/ffffff?text=Tobacco",
            category: "Жидкости",
            categoryId: "liquids",
            description: "Классический табачный вкус для ценителей. Крепость: 12мг, Объем: 30мл"
        }
    ],
    vapes: [
        {
            id: 4,
            name: "VaporMax Pro",
            price: 3500,
            image: "https://via.placeholder.com/300x300/ec4899/ffffff?text=VaporMax",
            category: "Парогенераторы",
            categoryId: "vapes",
            description: "Профессиональный парогенератор с регулировкой мощности до 200W. Два аккумулятора 18650 в комплекте."
        },
        {
            id: 5,
            name: "CloudBeast Mini",
            price: 2200,
            image: "https://via.placeholder.com/300x300/8b5cf6/ffffff?text=CloudBeast",
            category: "Парогенераторы",
            categoryId: "vapes",
            description: "Компактный и мощный парогенератор. Мощность до 80W, встроенный аккумулятор 2500mAh."
        }
    ],
    disposable: [
        {
            id: 6,
            name: "ElfBar 5000",
            price: 890,
            image: "https://via.placeholder.com/300x300/06b6d4/ffffff?text=ElfBar",
            category: "Одноразовые",
            categoryId: "disposable",
            description: "Одноразовая электронная сигарета на 5000 затяжек. Вкус: Арбуз-Лёд"
        },
        {
            id: 7,
            name: "HQD King",
            price: 750,
            image: "https://via.placeholder.com/300x300/f59e0b/ffffff?text=HQD",
            category: "Одноразовые",
            categoryId: "disposable",
            description: "Премиальная одноразка на 2000 затяжек. Вкус: Манго-Маракуйя"
        }
    ],
    tobacco: [
        {
            id: 8,
            name: "Parliament Aqua",
            price: 180,
            image: "https://via.placeholder.com/300x300/64748b/ffffff?text=Parliament",
            category: "Табачные изделия",
            categoryId: "tobacco",
            description: "Классические сигареты с угольным фильтром. Содержание смол: 4мг, никотина: 0.4мг"
        }
    ],
    boosters: [
        {
            id: 9,
            name: "NicBoost 20mg",
            price: 120,
            image: "https://via.placeholder.com/300x300/dc2626/ffffff?text=NicBoost",
            category: "Никобустеры",
            categoryId: "boosters",
            description: "Никотиновый бустер 20мг/мл для самозамеса. Объем: 10мл"
        }
    ]
};

// Текущая категория
let currentCategory = 'liquids';
let allProducts = [];

// Страницы
const pages = {
    page1: document.getElementById('page1'),
    page2: document.getElementById('page2'),
    page3: document.getElementById('page3'),
    page4: document.getElementById('page4')
};

// СТРАНИЦА 1: Выбор темы
const colorBoxes = document.querySelectorAll('.color-box');
const nextBtn1 = document.getElementById('nextBtn1');

colorBoxes.forEach(box => {
    box.addEventListener('click', function() {
        colorBoxes.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        appData.theme = this.parentElement.dataset.theme;
        nextBtn1.classList.add('active');
        nextBtn1.style.opacity = '1';
        nextBtn1.style.pointerEvents = 'auto';
        if (navigator.vibrate) navigator.vibrate(50);
    });
});

nextBtn1.addEventListener('click', function() {
    if (!appData.theme) {
        tg.showAlert('Пожалуйста, выберите тему!');
        return;
    }
    transitionToPage(pages.page1, pages.page2);
});

// СТРАНИЦА 2: Выбор города
const cityCards = document.querySelectorAll('.city-card');
const nextBtn2 = document.getElementById('nextBtn2');

cityCards.forEach(card => {
    card.addEventListener('click', function() {
        cityCards.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        appData.city = this.dataset.city;
        nextBtn2.classList.add('active');
        nextBtn2.style.opacity = '1';
        nextBtn2.style.pointerEvents = 'auto';
        if (navigator.vibrate) navigator.vibrate(50);
    });
});

nextBtn2.addEventListener('click', function() {
    if (!appData.city) {
        tg.showAlert('Пожалуйста, выберите город!');
        return;
    }
    transitionToPage(pages.page2, pages.page3);
    document.getElementById('selectedTheme').textContent = 
        appData.theme === 'dark' ? 'Тёмная' : 'Светлая';
    document.getElementById('selectedCity').textContent = 
        appData.city === 'moscow1' ? 'Москва' : 'Москва 2';
});

// СТРАНИЦА 3: Завершение
const finalBtn = document.getElementById('finalBtn');

finalBtn.addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 200);
    
    // Переход к каталогу
    transitionToPage(pages.page3, pages.page4);
    initializeCatalog();
});

// СТРАНИЦА 4: Каталог
function initializeCatalog() {
    // Собираем все товары
    allProducts = [
        ...products.liquids,
        ...products.vapes,
        ...products.disposable,
        ...products.tobacco,
        ...products.boosters
    ];
    
    // Показываем товары первой категории
    displayProducts(products.liquids);
    
    // Инициализация обработчиков
    initCategoryHandlers();
    initSearchHandler();
    initFilterHandlers();
}

// Отображение товаров
function displayProducts(productsList) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    productsList.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <div class="product-price">${product.price} ₽</div>
                <button class="product-details-btn" onclick="openProductModal(${product.id})">
                    Подробнее
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Обработчики категорий
function initCategoryHandlers() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            currentCategory = category;
            
            if (products[category]) {
                displayProducts(products[category]);
            }
            
            if (navigator.vibrate) navigator.vibrate(30);
        });
    });
}

// Поиск
function initSearchHandler() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        
        if (query === '') {
            displayProducts(products[currentCategory]);
            return;
        }
        
        const filtered = allProducts.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
        
        displayProducts(filtered);
    });
}

// Фильтры
function initFilterHandlers() {
    const applyBtn = document.getElementById('applyFilter');
    
    applyBtn.addEventListener('click', function() {
        const sortType = document.getElementById('sortFilter').value;
        const minPrice = parseInt(document.getElementById('priceMin').value) || 0;
        const maxPrice = parseInt(document.getElementById('priceMax').value) || 999999;
        
        let filtered = products[currentCategory].filter(p => 
            p.price >= minPrice && p.price <= maxPrice
        );
        
        // Сортировка
        if (sortType === 'cheap') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortType === 'expensive') {
            filtered.sort((a, b) => b.price - a.price);
        }
        
        displayProducts(filtered);
        
        if (navigator.vibrate) navigator.vibrate(30);
    });
}

// Модальное окно товара
function openProductModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = `${product.price} ₽`;
    document.getElementById('modalCategory').textContent = product.category;
    document.getElementById('descriptionText').textContent = product.description;
    
    modal.style.display = 'block';
    
    // Анимация открытия
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 10);
}

// Закрытие модального окна
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('productModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Развернуть/Свернуть описание
document.getElementById('toggleDesc').addEventListener('click', function() {
    const descText = document.getElementById('descriptionText');
    this.classList.toggle('expanded');
    descText.classList.toggle('expanded');
    
    const btnText = this.querySelector('span');
    btnText.textContent = this.classList.contains('expanded') ? 'Свернуть' : 'Развернуть';
});

// Кнопка покупки
document.getElementById('buyBtn').addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 200);
    
    tg.showPopup({
        title: 'Товар добавлен!',
        message: 'Товар успешно добавлен в корзину',
        buttons: [{type: 'ok'}]
    });
    
    closeModal();
});

// Функция перехода между страницами
function transitionToPage(fromPage, toPage) {
    fromPage.style.animation = 'pageSlideOut 0.5s ease-out';
    
    setTimeout(() => {
        fromPage.classList.remove('active');
        toPage.classList.add('active');
    }, 500);
}

// Анимация для страниц
const style = document.createElement('style');
style.textContent = `
    @keyframes pageSlideOut {
        to {
            opacity: 0;
            transform: translateX(-100px) scale(0.9);
        }
    }
    @keyframes productAppear {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;
document.head.appendChild(style);

// Установка цвета хедера Telegram
tg.setHeaderColor('#f5f7fa');
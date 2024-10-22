function increaseQuantity(button, productId) {
    const liElement = button.closest('li'); // Находим li элемент
    const currentPageElementBasket = document.getElementById("currentPageBasket");
    const numberInBasket = liElement.querySelector('.number-in-basket'); // Количество товара

    const basketIncrease = {
        productId: parseInt(productId), // Используем id товара вместо имени
        page: parseInt(currentPageElementBasket.innerText) // Обязательно преобразуем в число
    };

    fetch('/basket/increase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Указываем правильный тип
        },
        body: JSON.stringify(basketIncrease) // Отправляем JSON-строку
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    // Обработка ошибки
                    showWarningMessage(data); // Выводим сообщение об ошибке
                    throw new Error(data);
                });
            }
            let currentValue = parseInt(numberInBasket.innerText) || 0;
            numberInBasket.innerText = currentValue + 1;
            return response.json(); // Нужно вернуть response.json() для дальнейшего использования
        })
        .then(data => {
            updateBasketCatalog(data.items); // Обновляем данные корзины
        })
        .catch(error => console.log('Ошибка: ', error));
}
function showWarningMessage(message) {
    // Создаем или находим элемент для предупреждений
    let warningElement = document.getElementById('warningMessage');
    if (!warningElement) {
        warningElement = document.createElement('div');
        warningElement.id = 'warningMessage';
        warningElement.style.position = 'fixed';
        warningElement.style.top = '10px';
        warningElement.style.right = '10px';
        warningElement.style.backgroundColor = '#f8d7da';
        warningElement.style.color = '#721c24';
        warningElement.style.padding = '10px';
        warningElement.style.border = '1px solid #f5c6cb';
        warningElement.style.borderRadius = '5px';
        warningElement.style.zIndex = '1000';
        document.body.appendChild(warningElement);
    }

    // Устанавливаем текст предупреждения
    warningElement.innerText = message;

    // Показываем предупреждение на 5 секунд, затем скрываем
    warningElement.style.display = 'block';
    setTimeout(() => {
        warningElement.style.display = 'none';
    }, 5000);
}


function decreaseQuantity(button, productId) {
    const liElement = button.closest('li'); // Находим li элемент
    // const productId = liElement.getAttribute('data-product-id'); // Получаем id продукта
    const numberInBasket = liElement.querySelector('.number-in-basket'); // Количество товара
    const currentPageElementBasket = document.getElementById("currentPageBasket");
    let currentPage = parseInt(currentPageElementBasket.innerText, 10);

    // Проверка на наличие элемента numberInBasket
    if (!numberInBasket) {
        console.error('Элемент с классом number-in-basket не найден в DOM');
        return;
    }

    const basketDecrease = {
        productId: parseInt(productId), // Используем id товара вместо имени
        page: currentPage
    };

    fetch('/basket/decrease', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(basketDecrease)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при уменьшении количества товара');
            }
            return response.json();
        })
        .then(data => {
            updateBasketCatalog(data.items); // Обновляем данные корзины

            let currentValue = parseInt(numberInBasket.innerText) || 0;
            let newValue = Math.max(0, currentValue - 1);
            numberInBasket.innerText = newValue;

            if (newValue <= 0) {
                liElement.remove(); // Удаляем товар из DOM, если количество стало 0
            }

            const totalPages = data.totalPages;
            checkPaginationButtonsBasket(currentPage, totalPages);
        })
        .catch(error => console.error('Ошибка: ', error));
}
function updateBasketCatalog(items) {
    const itemsContainer = document.querySelector('#itemsContainer');
    const productsBasket = document.querySelector('.productsBasket');
    const orderNav = document.querySelector('.order-nav');
    const contactForm = document.querySelector('.contact-form');
    itemsContainer.innerHTML = '';

    if (items.length === 0) {
        orderNav.style.display = "none";
        contactForm.style.display = "none";
        productsBasket.innerHTML = `
        <div class="empty-basket-wrapper">
            <p class="basket-empty">Корзина пуста</p>
        </div>`;
        return;
    }

    orderNav.style.display = "flex"; // Показываем навигационную панель на десктопах
    contactForm.style.display = "block"; // Показываем форму контакта

    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.classList.add('order-products');

        listItem.innerHTML = `
        <div class="item-sel">
            <strong>Название:</strong> ${item.name || 'N/A'}
        </div>
        <div class="item-sel article">
            <strong>Артикул:</strong> ${item.article || 'N/A'}
        </div>
        <div class="item-sel price">
            <strong>Цена:</strong> ${item.price ? item.price + ' руб.' : 'N/A'}
        </div>
        <div class="item-sel">
            <strong>В корзине:</strong>
            <button class="decrease-key" onclick="decreaseQuantity(this, ${item.id})">-</button>
            <span class="number-in-basket">${item.quantity || 1}</span>
            <button class="increase-key" onclick="increaseQuantity(this, ${item.id})">+</button>
        </div>
        <div class="idProduct" style="display: none">${item.id}</div>
        <div class="in-basket-form" style="display:none">${item.quantity}</div>
        <div class="article-form" style="display:none">${item.article}</div>
        <div class="name-form" style="display:none">${item.name}</div>
        <div class="price-form" style="display:none">${item.price}</div>
        `;


        itemsContainer.appendChild(listItem);
    });
}



function checkPaginationButtonsBasket(currentPage, totalPages) {
    const prevPageBasket = document.getElementById("prevPageBasket");
    const nextPageBasket = document.getElementById("nextPageBasket");

    if (totalPages <= 1) {
        prevPageBasket.style.display = "none";
        nextPageBasket.style.display = "none";
    } else {
        prevPageBasket.style.display = currentPage <= 1 ? "none" : "inline-block";
        nextPageBasket.style.display = currentPage >= totalPages ? "none" : "inline-block";
    }
}

function clearBasket() {
    fetch('/CleanBasket', {
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                // alert('Корзина очищена');
                loadBasketProducts(1); // Load the first page with an empty basket
            } else {
                console.error('Ошибка при очистке корзины');
            }
        })
        .catch(error => console.error('Ошибка:', error));
}

function serializeAndSendData() {
    const contactInfo = document.querySelector('input[name="contactInfo"]').value.trim();

    let basket = {};
    document.querySelectorAll('.order-products').forEach(item => {
        const productId = item.querySelector('.idProduct').innerText; // Получаем ID товара
        const name = item.querySelector('.name-form').innerText; // Название товара
        const quantity = parseInt(item.querySelector('.in-basket-form').innerText) || 1; // Количество товара
        const article = item.querySelector('.article-form').innerText; // Артикул товара
        const price = parseFloat(item.querySelector('.price-form').innerText) || 0; // Цена товара

        // Используем productId в качестве ключа и массив атрибутов в качестве значения
        basket[productId] = [quantity, name, article, price];
    });

    const orderData = {
        basket: basket,
        contact: contactInfo
    };

    showLoadingSpinner();


    fetch('/SendOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
        .then(response => {
            hideLoadingSpinner();
            if (response.ok) {
                showOrderModal("success");
                clearBasket();
            } else {
                console.error('Ошибка при отправке заказа');
                showOrderModal('error');
            }
        })
        .catch(error => {
            hideLoadingSpinner();
            console.error('Ошибка:', error);
            showOrderModal('error');
        });
    return false;
}


function loadBasketProducts(page = 1) {
    const url = `/basket/products?page=${page}&size=8`;
    fetch(url)
        .then(response => response.json())
        .then(data => {

            console.log(data)
            updateBasketCatalog(data.items);
            if (data.totalPages === 0) {
                return
            }
            document.getElementById('currentPageBasket').innerText = data.currentPage;
            checkPaginationButtonsBasket(data.currentPage, data.totalPages);
        })
        .catch(error => console.error('Ошибка:', error));
}


document.addEventListener("DOMContentLoaded", function () {
    const prevPageBasket = document.getElementById("prevPageBasket");
    const currentPageElementBasket = document.getElementById("currentPageBasket");
    const nextPageBasket = document.getElementById("nextPageBasket");

    const totalPagesElement = document.getElementById("totalPages");
    let totalPages = parseInt(totalPagesElement.innerText, 10);
    console.log(totalPages);

    prevPageBasket.addEventListener("click", function () {
        let currentPage = parseInt(currentPageElementBasket.innerText, 10);
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            loadBasketProducts(newPage);
            checkPaginationButtonsBasket(newPage, totalPages);
        }
    });

    nextPageBasket.addEventListener("click", function () {
        let currentPage = parseInt(currentPageElementBasket.innerText, 10);
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            loadBasketProducts(newPage);
            checkPaginationButtonsBasket(newPage, totalPages);
        }
    });

    let initialPage = parseInt(currentPageElementBasket.innerText, 10);
    checkPaginationButtonsBasket(initialPage, totalPages);
    loadBasketProducts()
});

function showLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';
}

function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'none';
}

function showOrderModal(status) {
    const orderModal = document.getElementById('orderModal');

    if (!orderModal) {
        console.error('Модальное окно не найдено');
        return;
    }
    const modalContent = orderModal.querySelector('.modal-content p')
    if (!modalContent) {
        console.error('Элемент для отображения сообщения не найден');
        return;
    }

    if (status === 'success') {
        console.log("успех")
        modalContent.textContent = 'Ваш заказ успешно отправлен!';
    } else {
        modalContent.textContent = 'Произошла ошибка при отправке заказа. Пожалуйста, попробуйте еще раз.';
    }

    orderModal.style.display = 'block';
    // Закрываем модальное окно через 5 секунд
    setTimeout(() => {
        orderModal.style.display = 'none';

        // Если заказ успешно отправлен, перенаправляем пользователя на главную страницу
        if (status === 'success') {
            window.location.href = '/';
        }
    }, 2500);
}


// Функция для закрытия модального окна вручную (если у вас есть кнопка закрытия)
function closeModal() {
    const orderModal = document.getElementById('orderModal');
    orderModal.style.display = 'none';
    // Если заказ успешно отправлен, перенаправляем пользователя на главную страницу
    if (orderModal.querySelector('.modal-content p').textContent.includes('успешно')) {
        window.location.href = '/';
    }
}

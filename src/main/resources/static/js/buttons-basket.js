function increaseQuantity(button) {
    const liElement = button.closest('li');
    const productName = liElement.querySelector('.name').innerText;
    const currentPageElementBasket = document.getElementById("currentPageBasket");
    const numberInBasket = liElement.querySelector('.number-in-basket');
    const basketIncrease = {
        productName: productName,
        page: parseInt(currentPageElementBasket.innerText) // Обязательно преобразуйте в число
    };
    fetch('/basket/increase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Указываем правильный тип
        },
        body: JSON.stringify(basketIncrease) // Отправляем JSON-строку
    })
        .then(response => {
            console.log(response)
            if (response.ok) {
                console.log('Количество товара увеличено');
                let currentValue = parseInt(numberInBasket.innerText) || 0;
                numberInBasket.innerText = currentValue + 1;
                return response.json(); // Нужно вернуть response.json() для дальнейшего использования
            } else {
                console.error('Ошибка при увеличении количества товара');
            }
        })
        .then(data => {
            updateBasketCatalog(data.items);
        })
        .catch(error => console.error('Ошибка: ', error));
}


function decreaseQuantity(button) {
    const liElement = button.closest('li');
    const productName = liElement.querySelector('.name').innerText;
    const numberInBasket = liElement.querySelector('.number-in-basket');
    const currentPageElementBasket = document.getElementById("currentPageBasket");
    let currentPage = parseInt(currentPageElementBasket.innerText, 10);
    const basketDecrease = {
        productName: productName,
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
            // Обновляем отображение корзины
            updateBasketCatalog(data.items);

            // Если есть элементы, уменьшаем их количество на экране
            if (data.items.length > 0) {
                console.log('Количество товара уменьшено');
                let currentValue = parseInt(numberInBasket.innerText) || 0;
                let newValue = Math.max(0, currentValue - 1);
                numberInBasket.innerText = newValue;

                if (newValue <= 0) {
                    liElement.remove();
                }

                const totalPages = data.totalPages;
                checkPaginationButtonsBasket(currentPage, totalPages);
            } else {
                // Если на текущей странице нет элементов, переходим на предыдущую страницу
                if (currentPage > 1) {
                    loadBasketProducts(currentPage - 1);
                } else {
                    // Если нет предыдущей страницы и корзина пуста
                    alert('Корзина пуста');
                }
            }
        })
        .catch(error => console.error('Ошибка: ', error));
}

function updateBasketCatalog(items) {
    // const itemsContainer = document.querySelector('#itemsContainer');
    const productsBasket = document.querySelector('.productsBasket');
    const orderNav = document.querySelector('.order-nav')
    const contactForm = document.querySelector('.contact-form')
    itemsContainer.innerHTML = '';

    if (items.length === 0) {
        // Если элементов нет, показать сообщение
        orderNav.style.display = "none"
        contactForm.style.display = "none"
        productsBasket.innerHTML = '<p class="basket-empty">Корзина пуста</p>';
        return;
    }

    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.classList.add('order-products');

        listItem.innerHTML = `
            <div class="item-sel">
                <span class="name">${item.name}</span>
            </div>
            <div class="item-sel">
                <span class="article">${item.article}</span>
            </div>
            <div class="item-sel">
                <span class="number-in-stock">${item.price}</span>
            </div>
            <div class="item-sel">
                <button class="decrease-key" onclick="decreaseQuantity(this)">-</button>
                <span class="number-in-basket">${item.inBasket}</span>
                <button class="increase-key" onclick="increaseQuantity(this)">+</button>
            </div>
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
    const contactInfo = document.querySelector('input[name="contactInfo"]').value;

    let basket = {};
    document.querySelectorAll('.order-products').forEach(item => {
        const name = item.querySelector('.name').innerText;
        const quantity = parseInt(item.querySelector('.number-in-basket').innerText) || 0;
        const article = item.querySelector('.article').innerText;
        const price = parseFloat(item.querySelector('.number-in-stock').innerText) || 0;
        const inStock = parseInt(item.querySelector('.number-in-stock').innerText) || 0;

        basket[name] = [quantity, "Unknown Category", article, price, inStock];
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
    const url = `/basket/products?page=${page}&size=5`;
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

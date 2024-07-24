function increaseQuantity(button) {
    const liElement = button.closest('li');
    const productName = liElement.querySelector('.name').innerText;
    const numberInBasket = liElement.querySelector('.number-in-basket');

    fetch('/basket/increase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'productName=' + encodeURIComponent(productName)
    })
        .then(response => {
            if (response.ok) {
                console.log('Количество товара увеличено');
                // Увеличьте значение в .number-in-basket
                let currentValue = parseInt(numberInBasket.innerText) || 0;
                numberInBasket.innerText = currentValue + 1;
            } else {
                console.error('Ошибка при увеличении количества товара');
            }
        })
        .catch(error => console.error('Ошибка: ', error));
}
function decreaseQuantity(button) {
    const liElement = button.closest('li');
    const productName = liElement.querySelector('.name').innerText;
    const numberInBasket = liElement.querySelector('.number-in-basket');

    fetch('/basket/decrease', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'productName=' + encodeURIComponent(productName)
    })
        .then(response => {
            if (response.ok) {
                console.log('Количество товара уменьшено');
                let currentValue = parseInt(numberInBasket.innerText) || 0;
                let newValue = Math.max(0, currentValue - 1);
                numberInBasket.innerText = newValue;
                // Если количество равно нулю, скрыть элемент списка
                if (newValue <= 0) {
                    liElement.style.display = 'none'; // Скрываем элемент
                }
            } else if (response.status === 400) {
                console.error('Количество товара не может быть уменьшено');
            } else {
                console.error('Ошибка при уменьшении количества товара');
            }
        })
        .catch(error => console.error('Ошибка: ', error));
}
function serializeAndSendData() {

    document.getElementById('loadingSpinner').style.display = 'block';

    // Получаем контактную информацию
    const contact = document.querySelector('input[name="contactInfo"]').value;

    // Собираем данные корзины
    let basket = {};
    document.querySelectorAll('.order-products').forEach(item => {
        const name = item.querySelector('.name').textContent;
        const quantity = parseInt(item.querySelector('.number-in-basket').textContent) || 0;
        const article = item.querySelector('.article').textContent;
        const inStock = parseInt(item.querySelector('.number-in-stock').textContent) || 0;
        basket[name] = [quantity, "NotDefined", article, "NotDefined", inStock]; // Оставляем место для данных, которые не указаны в текущем примере
    });

    // Предотвращаем переход на другую страницу
    fetch('/SendOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ basket, contact })
    })
        .then(response => {
            if (response.ok) {
                document.getElementById('loadingSpinner').style.display = 'none';
                clearBasket();

                return response.text();
            }// Получаем текстовый ответ
        })
        .then(data => {
            if (data) { // Проверяем, не пустой ли текст
                // const jsonData = JSON.parse(data); // Превращаем текст в JSON
                // console.log(jsonData); // Делаем что-то с обработанным JSON
                window.location.href = '/Success'; // Добавлено перенаправление на страницу /Success
            } else {
                console.log("No data returned from the server");
            }
        })
        .catch(error => {
            document.getElementById('loadingSpinner').style.display = 'none';
            console.error(error)});  // Обработка ошибки
    return false;
}
function showOrderModal() {
    let modal = document.getElementById("orderModal");
    modal.style.display = "block";

    // Закрыть модальное окно при клике на (x)
    let span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Закрыть модальное окно при клике вне его
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function clearBasket() {
    // Очистить содержимое HTML-элемента корзины
    fetch('/CleanBasket',{
        method: "GET",
        headers: {
        }
        }
    )
    document.querySelector('.productsBasket').innerHTML = '';
    // Можно также очистить данные корзины, если они хранятся в JavaScript
}

window.onload = function() {
    var orderProducts = document.querySelectorAll('.order-products'); // Получаем все товары
    var contactForm = document.querySelector('.contact-form');
    var orderList =  document.querySelector('.order-list');
    // Проверяем, есть ли элементы в списке товаров корзины
    if(orderProducts.length === 0) {
        // Если нет элементов, скрываем форму
        contactForm.style.display = 'none';
        orderList.style.display = 'none';


        // Создаем и отображаем сообщение о том, что корзина пуста
        var emptyBasketMessage = document.createElement('div');
        emptyBasketMessage.innerHTML = "Вы пока не добавили товар в корзину";
        emptyBasketMessage.className = 'empty-basket-message'; // Можете добавить стили для этого класса в CSS

        //Добавляем сообщение прямо после .order-list
        var orderList = document.querySelector('.order-list');
        orderList.insertAdjacentElement('afterend', emptyBasketMessage);
    }
};


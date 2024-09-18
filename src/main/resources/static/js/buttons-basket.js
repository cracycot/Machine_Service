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
    const basketDecrease = {
        productName: productName,
        page: parseInt(currentPageElementBasket.innerText) // Обязательно преобразуйте в число
    };
    fetch('/basket/decrease', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Указываем правильный тип
        },
        body: JSON.stringify(basketDecrease) // Отправляем JSON-строку
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при уменьшении количества товара');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.items) {
                updateBasketCatalog(data.items);
            } else {
                console.error('Данные о товарах не найдены в ответе сервера');
            }
            console.log('Количество товара уменьшено');
            let currentValue = parseInt(numberInBasket.innerText) || 0;
            let newValue = Math.max(0, currentValue - 1);
            numberInBasket.innerText = newValue;

            if (newValue <= 0) {
                liElement.remove();
            }

            const totalPages = data.totalPages;
            checkPaginationButtonsBasket(parseInt(document.getElementById('currentPageBasket').innerText, 10), totalPages);
        })
        .catch(error => console.error('Ошибка: ', error));

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

    fetch('/SendOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '/Success';
            } else {
                console.error('Ошибка при отправке заказа');
                alert('Произошла ошибка при отправке заказа. Попробуйте еще раз.');
            }
        })
        .catch(error => console.error('Ошибка:', error));

    return false;
}
function updateBasketCatalog(items) {
    const itemsContainer = document.querySelector('#itemsContainer');
    itemsContainer.innerHTML = '';

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

document.addEventListener("DOMContentLoaded", function() {
    const prevPageBasket = document.getElementById("prevPageBasket");
    const currentPageElementBasket = document.getElementById("currentPageBasket");
    const nextPageBasket = document.getElementById("nextPageBasket");

    const totalPagesElement = document.getElementById("totalPages");
    let totalPages = parseInt(totalPagesElement.innerText, 10);
    console.log(totalPages);

    prevPageBasket.addEventListener("click", function() {
        let currentPage = parseInt(currentPageElementBasket.innerText, 10);
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            loadBasketProducts(newPage);
            checkPaginationButtonsBasket(newPage, totalPages);
        }
    });

    nextPageBasket.addEventListener("click", function() {
        let currentPage = parseInt(currentPageElementBasket.innerText, 10);
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            loadBasketProducts(newPage);
            checkPaginationButtonsBasket(newPage, totalPages);
        }
    });

    function loadBasketProducts(page = 1) {
        const url = `/basket/products?page=${page}&size=5`;
        console.log("отправил запрос на basket")

        fetch(url)
            .then(response => response.json())
            .then(data => {
                updateBasketCatalog(data.items);
                currentPageElementBasket.innerText = data.currentPage;
                totalPages = data.totalPages;
                checkPaginationButtonsBasket(data.currentPage, data.totalPages);
            })
            .catch(error => console.error('Ошибка:', error));
    }



    let initialPage = parseInt(currentPageElementBasket.innerText, 10);
    checkPaginationButtonsBasket(initialPage, totalPages);
    loadBasketProducts()
});

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
document.addEventListener("DOMContentLoaded", function() {
    const prevPageBasket = document.getElementById("prevPageBasket");
    const currentPageElementBasket = document.getElementById("currentPageBasket");
    const nextPageBasket = document.getElementById("nextPageBasket");

    const totalPagesElement = document.getElementById("totalPages");
    let totalPages = parseInt(totalPagesElement.innerText, 10);

    prevPageBasket.addEventListener("click", function() {
        let currentPage = parseInt(currentPageElementBasket.innerText, 10);
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            loadBasketProducts(newPage);
        }
    });

    nextPageBasket.addEventListener("click", function() {
        let currentPage = parseInt(currentPageElementBasket.innerText, 10);
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            loadBasketProducts(newPage);
        }
    });

    function loadBasketProducts(page = 1) {
        const url = `/basket/products?page=${page}&size=5`;

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

    function updateBasketCatalog(items) {
        const itemsContainer = document.querySelector('#itemsContainer');
        itemsContainer.innerHTML = ''; // Очищаем текущий список товаров

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
                <span class="number-in-basket">${item.quantity}</span>
                <button class="increase-key" onclick="increaseQuantity(this)">+</button>
            </div>
        `;

            itemsContainer.appendChild(listItem);
        });
    }



    function checkPaginationButtonsBasket(currentPage, totalPages) {
        if (currentPage <= 1) {
            prevPageBasket.disabled = true;
        } else {
            prevPageBasket.disabled = false;
        }

        if (currentPage >= totalPages) {
            nextPageBasket.disabled = true;
        } else {
            nextPageBasket.disabled = false;
        }
    }

    // Инициализируем состояние кнопок пагинации
    let initialPage = parseInt(currentPageElementBasket.innerText, 10);
    checkPaginationButtonsBasket(initialPage, totalPages);
});


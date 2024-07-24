// document.addEventListener('DOMContentLoaded', function () {
//     var searchForm = document.getElementById('searchForm');
//     var searchInput = document.getElementById('searchInput');
//     var itemsList = document.getElementById('itemsList');
//     var currentPage = document.getElementById('currentPage');
//
//     searchForm.addEventListener('submit', function (e) {
//         e.preventDefault();
//         fetchItems(searchInput.value, Math.max(1, parseInt(currentPage.innerText, 10)));
//     });
//
//     function fetchItems(searchQuery, page) {
//         // Обращение к серверу за данными.
//         // Предполагается, что сервер принимает page и searchQuery как GET параметры
//         // и возвращает JSON с элементами и информацией о странице.
//
//         fetch(`/product/searchproduct?page=${page}&search=${searchQuery}`)
//     .then(response => response.json())
//             .then(data => {
//                 renderItems(data.items);
//                 updatePagination(Math.max(1,data.page));
//             });
//     }
//
//     function renderItems(items) {
//         itemsList.innerHTML = ''; // Очистка текущего содержимого списка
//         items.forEach(item => {
//             var li = document.createElement('li');
//             li.textContent = item.name;
//             itemsList.appendChild(li);
//
//             // Добавляем кнопку 'Добавить в корзину'
//             var button = document.createElement('button');
//             button.textContent = 'Добавить в корзину';
//             button.className = 'add-to-cart-btn';
//             button.setAttribute('data-product-id', item.id);
//             button.addEventListener('click', function() {
//                 // Логика добавления в корзину
//             });
//             li.appendChild(button);
//         });
//     }
//
//     function updatePagination(page) {
//         // Обновление информации о страницах и пагинации
//         currentPage.innerText = page.number;
//         document.getElementById('prevPage').style.display = page.number > 1 ? 'inline-block' : 'none';
//         document.getElementById('nextPage').style.display = page.number < page.totalPages ? 'inline-block' : 'none';
//     }
//
//     // Загрузка начального списка элементов
//     fetchItems('', 1);
// });
document.addEventListener("DOMContentLoaded", function() {


    // Обработка кнопок пагинации
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");
    prevPage.addEventListener("click", function() {
        const currentPageElement = document.getElementById("currentPage");
        let currentPage = parseInt(currentPageElement.innerText, 10);
        console.log(currentPage);
        if (currentPage > 1) {
            currentPage -= 1; // Уменьшаем номер текущей страницы на 1
            currentPageElement.innerText = currentPage; // Обновляем отображаемое значение
            checkPaginationButtons(currentPage, parseInt(document.getElementById("totalPages").innerText, 10));
            loadProducts(currentPage);
        }
    });

    nextPage.addEventListener("click", function() {
        const currentPageElement = document.getElementById("currentPage");
        let currentPage = parseInt(currentPageElement.innerText, 10);
        const totalPages = parseInt(document.getElementById("totalPages").innerText, 10);
        console.log(totalPages);
        if (currentPage < totalPages) {
            currentPage += 1; // Увеличиваем номер текущей страницы на 1
            currentPageElement.innerText = currentPage; // Обновляем отображаемое значение
            checkPaginationButtons(currentPage, totalPages);
            loadProducts(currentPage);
        }
    });
    const filterForm = document.getElementById('filterForm');

    filterForm.addEventListener('submit', function(e) {
        // Предотвращаем стандартное поведение формы (перезагрузку страницы)
        e.preventDefault();

        // Собираем данные формы
        const brand = document.getElementById('brand').value;
        const priceFrom = document.getElementById('priceFrom').value || 0;
        const priceTo = document.getElementById('priceTo').value || 10000; // предположим, что 10000 — это максимально возможное значение
        const page = 1; // По умолчанию запрашиваем первую страницу
        const size = 5; // Размер страницы — количество товаров на странице

        // Создаем URL с параметрами для запроса
        const url = new URL('http://localhost:8080/product/filterproduct');
        url.searchParams.append('search', brand);
        url.searchParams.append('min', priceFrom);
        url.searchParams.append('max', priceTo);
        url.searchParams.append('page', page);
        url.searchParams.append('size', size);

        // Отправляем запрос на сервер с использованием Fetch API
        fetch(url, {
            method: 'GET', // Тип запроса
            // Здесь можно добавить дополнительные настройки, такие как headers, если они необходимы
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const totalPages = response.headers.get("Total-Pages");
                document.getElementById("totalPages").innerText = totalPages;
                return response.json();// Преобразуем ответ в JSON
            })
            .then(data => {
                console.log(data);
                updateCatalog(data);
                checkPaginationButtons(parseInt(document.getElementById("currentPage").innerText, 10), parseInt(document.getElementById("totalPages").innerText, 10));
// Обработка полученных данных
                // Здесь вы можете обновлять DOM на основе полученных данных, например, отобразить результаты фильтрации
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    });


// Функция для проверки и обновления состояния кнопок пагинации
    function checkPaginationButtons(currentPage, totalPages) {
        // Если только одна страница – скрываем обе кнопки пагинации
        if(totalPages <= 1) {
            console.log("Hidden_all")
            prevPage.style.display = "none";
            nextPage.style.display = "none";
        }
        else {
            // Проверяем, является ли текущая страница первой
            if(currentPage <= 1) {
                prevPage.style.display = "none"; // Скрываем кнопку "предыдущая страница"
            } else {
                prevPage.style.display = "inline-block"; // Показываем кнопку "предыдущая страница"
            }
            // Проверяем, является ли текущая страница последней
            if(currentPage >= totalPages) {
                nextPage.style.display = "none"; // Скрываем кнопку "следующая страница"
            } else {
                nextPage.style.display = "inline-block"; // Показываем кнопку "следующая страница"
            }
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        // ...
        // Первоначальная проверка кнопок пагинации с учетом текущего и общего количества страниц.
        checkPaginationButtons(parseInt(document.getElementById("currentPage").innerText, 10), parseInt(document.getElementById("totalPages").innerText, 10));
        // ...
    });



    // Обработка формы поиска
    const searchForm = document.getElementById("searchForm");
    searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
        loadProducts();
        console.log(parseInt(document.getElementById("currentPage").innerText));
        console.log(parseInt(document.getElementById("totalPages").innerText));
        checkPaginationButtons(parseInt(document.getElementById("currentPage").innerText, 10), parseInt(document.getElementById("totalPages").innerText, 10));
    });
    searchForm.addEventListener("click", function (e) {
        e.preventDefault();
        loadProducts();
        //console.log(parseInt(document.getElementById("currentPage").innerText),parseInt(document.getElementById("totalPages").innerText) );
        checkPaginationButtons(parseInt(document.getElementById("currentPage").innerText, 10), parseInt(document.getElementById("totalPages").innerText, 10));
    });

    // Функция для загрузки продуктов
    function loadProducts(page = 1) {
        const searchValue = document.getElementById("searchInput").value;
        console.log(page);
        const url = `/product/searchproduct?search=${searchValue}&page=${page}&size=5`; // Указываем размер страницы, как в примере
        fetch(url)
            .then(response => {
                const totalPages = response.headers.get("Total-Pages");
                document.getElementById("totalPages").innerText = totalPages;
                return response.json();
            })
            .then(data => {
                updateCatalog(data);

                // Для обновления пагинации необходимо добавить дополнительный код здесь
            })
            .catch(error => console.error('Ошибка:', error));
    }

    function updateCatalog(products) {
        const itemsList = document.getElementById("itemsList");
        itemsList.innerHTML = ""; // Очищаем текущий список продуктов
        products.forEach(product => {
            const listItem = document.createElement("li" );
            listItem.innerHTML = `<span class= "item" id="product-name">${product.name}</span>
                <span class= "item" id="product-category">${product.category}</span>
                <span class= "item" id="product-article">${product.article}</span>
                <span class= "item" id="product-price">${product.price}р</span>
                <span class= "item" id="product-in-stock">${product.inStock} шт</span>
                <button type="button" class="add-to-cart-btn" data-product-id="${product.id}">Добавить в корзину</button>`;
            itemsList.appendChild(listItem);
        });
    }

    // Инициировать первую загрузку продуктов
    checkPaginationButtons(parseInt(document.getElementById("currentPage").innerText, 10), parseInt(document.getElementById("totalPages").innerText, 10));

    loadProducts();

});

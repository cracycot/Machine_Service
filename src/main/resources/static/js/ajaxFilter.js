document.addEventListener("DOMContentLoaded", function() {
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");
    prevPage.addEventListener("click", function() {
        const currentPage = parseInt(document.getElementById("currentPage").innerText, 10);
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            document.getElementById("currentPage").innerText = newPage;
            loadProducts(newPage);
            checkPaginationButtons(newPage, parseInt(document.getElementById("totalPages").innerText, 10));
        }
    });

    nextPage.addEventListener("click", function() {
        const currentPage = parseInt(document.getElementById("currentPage").innerText, 10);
        const totalPages = parseInt(document.getElementById("totalPages").innerText, 10);
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            document.getElementById("currentPage").innerText = newPage;
            loadProducts(newPage);
            checkPaginationButtons(newPage, totalPages);
        }
    });
    const filterForm = document.getElementById('filterForm');
    const searchForm = document.getElementById("searchForm");
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const brand = document.getElementById('brand').value;
        const priceFrom = document.getElementById('priceFrom').value || 0;
        const priceTo = document.getElementById('priceTo').value || 100000000;
        const searchValue = document.getElementById("searchInput").value;
        const page = 1; // По умолчанию запрашиваем первую страницу
        const size = 5; // Размер страницы — количество товаров на странице

        const url = new URL('http://localhost:8080/product/filterproduct');
        url.searchParams.append('search', searchValue);
        url.searchParams.append('brand', brand === 'Выберите бренд' ? '' : brand);
        url.searchParams.append('min', priceFrom);
        url.searchParams.append('max', priceTo);
        url.searchParams.append('page', page);
        url.searchParams.append('size', size);

        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const totalPages = response.headers.get("Total-Pages");
                document.getElementById("totalPages").innerText = totalPages;
                return response.json();
            })
            .then(data => {
                updateCatalog(data);
                checkPaginationButtons(parseInt(document.getElementById("currentPage").innerText, 10), parseInt(document.getElementById("totalPages").innerText, 10));
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

    searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
        loadProducts();
        console.log(parseInt(document.getElementById("currentPage").innerText));
        console.log(parseInt(document.getElementById("totalPages").innerText));
        checkPaginationButtons(parseInt(document.getElementById("currentPage").innerText, 10), parseInt(document.getElementById("totalPages").innerText, 10));
    });
    // searchForm.addEventListener("click", function (e) {
    //     e.preventDefault();
    //     loadProducts();
    //     //console.log(parseInt(document.getElementById("currentPage").innerText),parseInt(document.getElementById("totalPages").innerText) );
    //     checkPaginationButtons(parseInt(document.getElementById("currentPage").innerText, 10), parseInt(document.getElementById("totalPages").innerText, 10));
    // });
    function loadProducts(page = 1) {
        const searchValue = document.getElementById("searchInput").value;
        const priceFrom = document.getElementById('priceFrom').value || 0;
        const priceTo = document.getElementById('priceTo').value || 100000000;
        const brand = document.getElementById('brand').value;
        const size = 5; // Размер страницы — количество товаров на странице
        const url = `/product/filterproduct?search=${searchValue}&brand=${'Выберите бренд' ? '' : brand}&min=${priceFrom}&max=${priceTo}&page=${page}&size=${size}`;
        fetch(url)
            .then(response => {
                const totalPages = response.headers.get("Total-Pages");
                document.getElementById("totalPages").innerText = totalPages;
                return response.json();
            })
            .then(data => {
                updateCatalog(data);
                checkPaginationButtons(page, parseInt(document.getElementById("totalPages").innerText, 10));
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
    // function checkPaginationButtons(currentPage, totalPages) {
    //     // Если всего одна страница, скрыть обе кнопки
    //     if (totalPages <= 1) {
    //         prevPage.style.display = "none";
    //         nextPage.style.display = "none";
    //     } else {
    //         // Скрываем кнопку "Предыдущая" на первой странице
    //         prevPage.style.display = currentPage <= 1 ? "none" : "inline-block";
    //         // Скрываем кнопку "Следующая" на последней странице
    //         nextPage.style.display = currentPage >= totalPages ? "none" : "inline-block";
    //     }
    // }
    loadProducts();

});

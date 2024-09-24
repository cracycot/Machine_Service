document.addEventListener("DOMContentLoaded", function() {
    const prevPage = document.getElementById("prevPage");
    const currentPageElement = document.getElementById("currentPage");
    const nextPage = document.getElementById("nextPage");
    prevPage.addEventListener("click", function() {
        const currentPage = parseInt(currentPageElement.innerText, 10);
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            currentPageElement.innerText = newPage;
            loadProducts(newPage);
            checkPaginationButtons(newPage, parseInt(document.getElementById("totalPages").innerText, 10));
        }
    });

    nextPage.addEventListener("click", function() {
        const currentPage = parseInt(currentPageElement.innerText, 10);
        const totalPages = parseInt(document.getElementById("totalPages").innerText, 10);
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            currentPageElement.innerText = newPage;
            loadProducts(newPage);
            checkPaginationButtons(newPage, totalPages);
        }
    });

    const filterForm = document.getElementById('filterForm');
    const searchForm = document.getElementById("searchForm");

    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        loadProducts(1);  // Сброс на первую страницу при применении фильтра
    });

    searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
        loadProducts(1);  // Сброс на первую страницу при поиске
    });

    function loadProducts(page = 1, flag = false) {
        const searchValue = document.getElementById("searchInput").value;
        const priceFrom = document.getElementById('priceFrom').value || 0;
        const priceTo = document.getElementById('priceTo').value || 100000000;
        const brand = document.getElementById('brand').value;

        const size = 5; // Размер страницы — количество товаров на странице
        const url = `/product/filterproduct?search=${searchValue}&brand=${brand === 'Выберите бренд' ? '' : brand}&min=${priceFrom}&max=${priceTo}&page=${page}&size=${size}`;

        fetch(url)
            .then(response => {
                const totalPages = response.headers.get("Total-Pages");
                document.getElementById("totalPages").innerText = totalPages;
                return response.json();
            })
            .then(data => {
                updateCatalog(data);
                if (flag) {
                    handleEmptyCatalog(data.length === 0);
                }
                checkPaginationButtons(page, parseInt(document.getElementById("totalPages").innerText, 10));
                currentPageElement.innerText = page; // Обновляем номер текущей страницы
            })
            .catch(error => console.error('Ошибка:', error));
    }

    function updateCatalog(products) {
        const itemsList = document.getElementById("itemsList");
        itemsList.innerHTML = ""; // Очищаем текущий список продуктов
        products.forEach(product => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<span class="item" id="product-name">${product.name}</span>
                <span class="item" id="product-category">${product.category}</span>
                <span class="item" id="product-article">${product.article}</span>
                <span class="item" id="product-price">${product.price}р</span>
                <span class="item" id="product-in-stock">${product.inStock} шт</span>
                <button type="button" class="add-to-cart-btn" data-product-id="${product.id}">Добавить в корзину</button>`;
            itemsList.appendChild(listItem);
        });
    }

    function checkPaginationButtons(currentPage, totalPages) {
        if (totalPages <= 1) {
            prevPage.style.display = "none";
            nextPage.style.display = "none";
        } else {
            prevPage.style.display = currentPage <= 1 ? "none" : "inline-block";
            nextPage.style.display = currentPage >= totalPages ? "none" : "inline-block";
        }
    }
    function handleEmptyCatalog(isEmpty) {
        const filterContainer = document.querySelector('.filter-container');
        const mainCatalog = document.querySelector('.main-catalog')
        const searchContainer = document.querySelector('.search-container');
        const catalogNav = document.querySelector('.catalog-nav');
        const  pagination = document.querySelector('.pagination')



        if (isEmpty) {
            filterContainer.style.display = "none";
            searchContainer.style.display = "none";
            catalogNav.style.display = "none";
            pagination.style.display = "none"
            mainCatalog.innerHTML = '<p class="catalog-empty">Каталог пуст</p>';
        } else {
            filterContainer.style.display = "block";
            searchContainer.style.display = "block";
            catalogNav.style.display = "block";
        }
    }
    const resetButton = document.getElementById('resetFilters');

    // Обработчик для кнопки сброса фильтров
    resetButton.addEventListener('click', function() {
        document.getElementById('brand').value = '';  // Сброс бренда
        document.getElementById('priceFrom').value = '';  // Сброс цены от
        document.getElementById('priceTo').value = '';  // Сброс цены до
        document.getElementById('searchInput').value = '';  // Сброс поиска
        loadProducts(1);  // Загрузка товаров без фильтров, начиная с первой страницы
    });
    // Инициализируем загрузку с первой страницы
    loadProducts(1, true);
});
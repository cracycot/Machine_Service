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
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        loadProducts(1);  // Сброс на первую страницу при применении фильтра
    });

    function loadProducts(page = 1, flag = false) {
        const searchValue = document.getElementById("searchInput").value;
        const priceFrom = document.getElementById('priceFrom').value || 0;
        const priceTo = document.getElementById('priceTo').value || 100000000;
        const brand = document.getElementById('brand').value;

        const size = 8; // Размер страницы — количество товаров на странице

        // Исправляем URL, используя обратные кавычки
        const url = `/product/filterproduct?search=${encodeURIComponent(searchValue)}&brand=${encodeURIComponent(brand === 'Выберите бренд' ? '' : brand)}&min=${priceFrom}&max=${priceTo}&page=${page}&size=${size}`;

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
    function checkPaginationButtons(currentPage, totalPages) {
        if (totalPages <= 1) {
            prevPage.style.display = "none";
            nextPage.style.display = "none";
        } else {
            prevPage.style.display = currentPage <= 1 ? "none" : "inline-block";
            nextPage.style.display = currentPage >= totalPages ? "none" : "inline-block";
        }
    }
    function updateCatalog(products) {
        const productGrid = document.getElementById("productGrid");
        productGrid.innerHTML = ""; // Очищаем текущий список товаров

        products.forEach(product => {
            // Создаем карточку товара
            const card = document.createElement("div");
            card.classList.add("product-card");

            card.addEventListener("click", function() {
                window.location.href = `/product/${product.id}`;
            });


            // Создаем элемент изображения
            const imageElement = document.createElement("img");
            imageElement.classList.add("product-image");
            imageElement.src = "/img/connection.jpg"; // Изображение по умолчанию

            // Если у продукта есть изображения, загружаем их
            if (product.fileNames && product.fileNames.length > 0) {
                fetch(`product/get/photos?productId=${product.id}`)
                    .then(response => response.json())
                    .then(base64Images => {
                        if (base64Images.length > 0) {
                            imageElement.src = `data:image/jpeg;base64,${base64Images[0]}`;
                        }
                    })
                    .catch(error => {
                        console.error('Ошибка при получении изображений:', error);
                    });
            }

            // Создаем контейнер для контента карточки
            const content = document.createElement("div");
            content.classList.add("product-card-content");

            // Название продукта
            const nameElement = document.createElement("h3");
            nameElement.textContent = product.name;

            // Категория или бренд (если нужно)
            const categoryElement = document.createElement("p");
            categoryElement.textContent = product.category;

            //id
            const articleElement = document.createElement("p");
            articleElement.textContent = product.article;

            // Цена
            const priceElement = document.createElement("div");
            priceElement.classList.add("price");
            priceElement.textContent = product.price + " р";

            // Кнопка "Добавить в корзину"
            const addToCartButton = document.createElement("button");
            addToCartButton.type = "button";
            addToCartButton.classList.add("add-to-cart-btn");
            addToCartButton.dataset.productId = product.id;
            addToCartButton.textContent = "Добавить в корзину";

            // Собираем контент карточки
            content.appendChild(nameElement);
            content.appendChild(categoryElement);
            content.appendChild(articleElement)
            content.appendChild(priceElement);
            content.appendChild(addToCartButton);

            // Собираем карточку товара
            card.appendChild(imageElement);
            card.appendChild(content);

            // productLink.appendChild(card);
            // Добавляем карточку в сетку продуктов
            productGrid.appendChild(card);
        })
       // checkPaginationButtons( ,parseInt(document.getElementById("totalPages").innerText);
    }

    function handleEmptyCatalog(isEmpty) {
        const filterContainer = document.querySelector('.filter-container');
        const mainCatalog = document.querySelector('.main-catalog');
        const catalogNav = document.querySelector('.catalog-nav');
        const pagination = document.querySelector('.pagination');

        if (isEmpty) {
            filterContainer.style.display = "none";
            pagination.style.display = "none";
            mainCatalog.innerHTML = '<p class="catalog-empty">Каталог пуст</p>';
        } else {
            filterContainer.style.display = "block";
            // searchContainer.style.display = "block";
            // catalogNav.style.display = "block";
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

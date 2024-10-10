// document.addEventListener("DOMContentLoaded", function() {
//     const prevPage = document.getElementById("prevPage");
//     const currentPageElement = document.getElementById("currentPage");
//     const nextPage = document.getElementById("nextPage");
//     prevPage.addEventListener("click", function() {
//         const currentPage = parseInt(currentPageElement.innerText, 10);
//         if (currentPage > 1) {
//             const newPage = currentPage - 1;
//             currentPageElement.innerText = newPage;
//             loadProducts(newPage);
//             checkPaginationButtons(newPage, parseInt(document.getElementById("totalPages").innerText, 10));
//         }
//     });
//
//     nextPage.addEventListener("click", function() {
//         const currentPage = parseInt(currentPageElement.innerText, 10);
//         const totalPages = parseInt(document.getElementById("totalPages").innerText, 10);
//         if (currentPage < totalPages) {
//             const newPage = currentPage + 1;
//             currentPageElement.innerText = newPage;
//             loadProducts(newPage);
//             checkPaginationButtons(newPage, totalPages);
//         }
//     });
//
//     const filterForm = document.getElementById('filterForm');
//     const searchForm = document.getElementById("searchForm");
//
//     filterForm.addEventListener('submit', function(e) {
//         e.preventDefault();
//         loadProducts(1);  // Сброс на первую страницу при применении фильтра
//     });
//
//     searchForm.addEventListener("submit", function(e) {
//         e.preventDefault();
//         loadProducts(1);  // Сброс на первую страницу при поиске
//     });
//
//     function loadProducts(page = 1, flag = false) {
//         const searchValue = document.getElementById("searchInput").value;
//         const priceFrom = document.getElementById('priceFrom').value || 0;
//         const priceTo = document.getElementById('priceTo').value || 100000000;
//         const brand = document.getElementById('brand').value;
//
//         const size = 5; // Размер страницы — количество товаров на странице
//         const url = `/product/filterproduct?search=${searchValue}&brand=${brand === 'Выберите бренд' ? '' : brand}&min=${priceFrom}&max=${priceTo}&page=${page}&size=${size}`;
//
//         fetch(url)
//             .then(response => {
//                 const totalPages = response.headers.get("Total-Pages");
//                 document.getElementById("totalPages").innerText = totalPages;
//                 return response.json();
//             })
//             .then(data => {
//                 updateCatalog(data);
//                 if (flag) {
//                     handleEmptyCatalog(data.length === 0);
//                 }
//                 checkPaginationButtons(page, parseInt(document.getElementById("totalPages").innerText, 10));
//                 currentPageElement.innerText = page; // Обновляем номер текущей страницы
//             })
//             .catch(error => console.error('Ошибка:', error));
//     }
//
//     // function updateCatalog(products) {
//     //     const itemsList = document.getElementById("itemsList");
//     //     itemsList.innerHTML = ""; // Очищаем текущий список продуктов
//     //     products.forEach(product => {
//     //         const listItem = document.createElement("li");
//     //         listItem.innerHTML = `<span class="item" id="product-name">${product.name}</span>
//     //             <span class="item" id="product-category">${product.category}</span>
//     //             <span class="item" id="product-article">${product.article}</span>
//     //             <span class="item" id="product-price">${product.price}р</span>
//     //             <span class="item" id="product-in-stock">${product.inStock} шт</span>
//     //             <button type="button" class="add-to-cart-btn" data-product-id="${product.id}">Добавить в корзину</button>`;
//     //         itemsList.appendChild(listItem);
//     //     });
//     // }
//     function updateCatalog(products) {
//         const itemsList = document.getElementById("itemsList");
//         itemsList.innerHTML = ""; // Очищаем текущий список товаров
//         products.forEach(product => {
//             const listItem = document.createElement("li");
//             listItem.classList.add("product-item");
//
//             // Создаем элемент изображения
//             const imageElement = document.createElement("img");
//             imageElement.classList.add("product-image");
//
//             // Проверяем, есть ли у товара изображения
//             if (product.imageUrls && product.imageUrls.length > 0) {
//                 imageElement.src = product.imageUrls[0]; // Используем первое изображение
//             } else {
//                 imageElement.src = "/img/connection.jpg"; // Путь к изображению по умолчанию
//             }
//
//             // Создаем остальные элементы
//             const nameElement = document.createElement("span");
//             nameElement.classList.add("item");
//             nameElement.id = "product-name";
//             nameElement.textContent = product.name;
//
//             const categoryElement = document.createElement("span");
//             categoryElement.classList.add("item");
//             categoryElement.id = "product-category";
//             categoryElement.textContent = product.category;
//
//             const articleElement = document.createElement("span");
//             articleElement.classList.add("item");
//             articleElement.id = "product-article";
//             articleElement.textContent = product.article;
//
//             const priceElement = document.createElement("span");
//             priceElement.classList.add("item");
//             priceElement.id = "product-price";
//             priceElement.textContent = product.price + "р";
//
//             const inStockElement = document.createElement("span");
//             inStockElement.classList.add("item");
//             inStockElement.id = "product-in-stock";
//             inStockElement.textContent = product.inStock + " шт";
//
//             const addToCartButton = document.createElement("button");
//             addToCartButton.type = "button";
//             addToCartButton.classList.add("add-to-cart-btn");
//             addToCartButton.dataset.productId = product.id;
//             addToCartButton.textContent = "Добавить в корзину";
//
//             // Собираем элемент списка
//             listItem.appendChild(imageElement);
//             listItem.appendChild(nameElement);
//             listItem.appendChild(categoryElement);
//             listItem.appendChild(articleElement);
//             listItem.appendChild(priceElement);
//             listItem.appendChild(inStockElement);
//             listItem.appendChild(addToCartButton);
//
//             itemsList.appendChild(listItem);
//         });
//     }
//
//
//     function checkPaginationButtons(currentPage, totalPages) {
//         if (totalPages <= 1) {
//             prevPage.style.display = "none";
//             nextPage.style.display = "none";
//         } else {
//             prevPage.style.display = currentPage <= 1 ? "none" : "inline-block";
//             nextPage.style.display = currentPage >= totalPages ? "none" : "inline-block";
//         }
//     }
//     function handleEmptyCatalog(isEmpty) {
//         const filterContainer = document.querySelector('.filter-container');
//         const mainCatalog = document.querySelector('.main-catalog')
//         const searchContainer = document.querySelector('.search-container');
//         const catalogNav = document.querySelector('.catalog-nav');
//         const  pagination = document.querySelector('.pagination')
//
//
//
//         if (isEmpty) {
//             filterContainer.style.display = "none";
//             searchContainer.style.display = "none";
//             catalogNav.style.display = "none";
//             pagination.style.display = "none"
//             mainCatalog.innerHTML = '<p class="catalog-empty">Каталог пуст</p>';
//         } else {
//             filterContainer.style.display = "block";
//             searchContainer.style.display = "block";
//             catalogNav.style.display = "block";
//         }
//     }
//     const resetButton = document.getElementById('resetFilters');
//
//     // Обработчик для кнопки сброса фильтров
//     resetButton.addEventListener('click', function() {
//         document.getElementById('brand').value = '';  // Сброс бренда
//         document.getElementById('priceFrom').value = '';  // Сброс цены от
//         document.getElementById('priceTo').value = '';  // Сброс цены до
//         document.getElementById('searchInput').value = '';  // Сброс поиска
//         loadProducts(1);  // Загрузка товаров без фильтров, начиная с первой страницы
//     });
//     // Инициализируем загрузку с первой страницы
//     loadProducts(1, true);
// });

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

    // function updateCatalog(products) {
    //     const itemsList = document.getElementById("itemsList");
    //     itemsList.innerHTML = ""; // Очищаем текущий список товаров
    //     products.forEach(product => {
    //         const listItem = document.createElement("li");
    //         listItem.classList.add("product-item");
    //
    //         // Создаем элемент изображения
    //         const imageElement = document.createElement("img");
    //         imageElement.classList.add("product-image");
    //
    //         console.log(product.imageUrls)
    //         // Проверяем, есть ли у товара изображения
    //         if (product.imageUrls && product.imageUrls.length > 0) {
    //             // Формируем корректный путь к изображению
    //             imageElement.src = `/products/${product.id}/image?fileName=${encodeURIComponent(product.imageUrls[0])}`;
    //         } else {
    //             imageElement.src = "/img/connection.jpg"; // Путь к изображению по умолчанию
    //         }
    //
    //         // Создаем остальные элементы
    //         const nameElement = document.createElement("span");
    //         nameElement.classList.add("item");
    //         nameElement.id = "product-name";
    //         nameElement.textContent = product.name;
    //
    //         const categoryElement = document.createElement("span");
    //         categoryElement.classList.add("item");
    //         categoryElement.id = "product-category";
    //         categoryElement.textContent = product.category;
    //
    //         const articleElement = document.createElement("span");
    //         articleElement.classList.add("item");
    //         articleElement.id = "product-article";
    //         articleElement.textContent = product.article;
    //
    //         const priceElement = document.createElement("span");
    //         priceElement.classList.add("item");
    //         priceElement.id = "product-price";
    //         priceElement.textContent = product.price + "р";
    //
    //         const inStockElement = document.createElement("span");
    //         inStockElement.classList.add("item");
    //         inStockElement.id = "product-in-stock";
    //         inStockElement.textContent = product.inStock + " шт";
    //
    //         const addToCartButton = document.createElement("button");
    //         addToCartButton.type = "button";
    //         addToCartButton.classList.add("add-to-cart-btn");
    //         addToCartButton.dataset.productId = product.id;
    //         addToCartButton.textContent = "Добавить в корзину";
    //
    //         // Собираем элемент списка
    //         listItem.appendChild(imageElement);
    //         listItem.appendChild(nameElement);
    //         listItem.appendChild(categoryElement);
    //         listItem.appendChild(articleElement);
    //         listItem.appendChild(priceElement);
    //         listItem.appendChild(inStockElement);
    //         listItem.appendChild(addToCartButton);
    //
    //         itemsList.appendChild(listItem);
    //     });
    // }
    function updateCatalog(products) {
        const itemsList = document.getElementById("itemsList");
        itemsList.innerHTML = ""; // Очищаем текущий список товаров

        products.forEach(product => {
            const listItem = document.createElement("li");
            listItem.classList.add("product-item");

            // Создаем элемент изображения
            const imageElement = document.createElement("img");
            imageElement.classList.add("product-image");

            // Устанавливаем изображение по умолчанию
            imageElement.src = "/img/connection.jpg";


            // Создаем остальные элементы
            const nameElement = document.createElement("span");
            nameElement.classList.add("item");
            nameElement.id = "product-name";
            nameElement.textContent = product.name;

            const categoryElement = document.createElement("span");
            categoryElement.classList.add("item");
            categoryElement.id = "product-category";
            categoryElement.textContent = product.category;

            const articleElement = document.createElement("span");
            articleElement.classList.add("item");
            articleElement.id = "product-article";
            articleElement.textContent = product.article;

            const priceElement = document.createElement("span");
            priceElement.classList.add("item");
            priceElement.id = "product-price";
            priceElement.textContent = product.price + "р";

            const inStockElement = document.createElement("span");
            inStockElement.classList.add("item");
            inStockElement.id = "product-in-stock";
            inStockElement.textContent = product.inStock + " шт";

            const addToCartButton = document.createElement("button");
            addToCartButton.type = "button";
            addToCartButton.classList.add("add-to-cart-btn");
            addToCartButton.dataset.productId = product.id;
            addToCartButton.textContent = "Добавить в корзину";

            // Собираем элемент списка
            listItem.appendChild(imageElement);
            listItem.appendChild(nameElement);
            listItem.appendChild(categoryElement);
            listItem.appendChild(articleElement);
            listItem.appendChild(priceElement);
            listItem.appendChild(inStockElement);
            listItem.appendChild(addToCartButton);

            itemsList.appendChild(listItem);

            // Если у продукта есть изображения, загружаем их
            if (product.imageUrls && product.imageUrls.length > 0) {
                fetch(`product/get/photos?productId=${product.id}`)
                    .then(response => response.json())
                    .then(base64Images => {
                        if (base64Images.length > 0) {
                            // Устанавливаем src изображения на первую полученную Base64-строку
                            imageElement.src = `data:image/jpeg;base64,${base64Images[0]}`;
                        }
                    })
                    .catch(error => {
                        console.error('Ошибка при получении изображений:', error);
                    });
            }
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
        const mainCatalog = document.querySelector('.main-catalog');
        const searchContainer = document.querySelector('.search-container');
        const catalogNav = document.querySelector('.catalog-nav');
        const pagination = document.querySelector('.pagination');

        if (isEmpty) {
            filterContainer.style.display = "none";
            searchContainer.style.display = "none";
            catalogNav.style.display = "none";
            pagination.style.display = "none";
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

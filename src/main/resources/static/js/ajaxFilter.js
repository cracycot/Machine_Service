// document.addEventListener("DOMContentLoaded", function() {
//     const prevPage = document.getElementById("prevPage");
//     const currentPageElement = document.getElementById("currentPage");
//     const nextPage = document.getElementById("nextPage");
//
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
//     filterForm.addEventListener('submit', function(e) {
//         e.preventDefault();
//         loadProducts(1);  // Сброс на первую страницу при применении фильтра
//     });
//
//     function loadProducts(page = 1, flag = false) {
//         const searchValue = document.getElementById("searchInput").value;
//         const priceFrom = document.getElementById('priceFrom').value || 0;
//         const priceTo = document.getElementById('priceTo').value || 100000000;
//         const brand = document.getElementById('brand').value;
//
//         const size = 8; // Размер страницы — количество товаров на странице
//
//         // Исправляем URL, используя обратные кавычки
//         const url = `/product/filterproduct?search=${encodeURIComponent(searchValue)}&brand=${encodeURIComponent(brand === 'Выберите бренд' ? '' : brand)}&min=${priceFrom}&max=${priceTo}&page=${page}&size=${size}`;
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
//     function checkPaginationButtons(currentPage, totalPages) {
//         if (totalPages <= 1) {
//             prevPage.style.display = "none";
//             nextPage.style.display = "none";
//         } else {
//             prevPage.style.display = currentPage <= 1 ? "none" : "inline-block";
//             nextPage.style.display = currentPage >= totalPages ? "none" : "inline-block";
//         }
//     }
//     function updateCatalog(products) {
//         const productGrid = document.getElementById("productGrid");
//         productGrid.innerHTML = ""; // Очищаем текущий список товаров
//
//         products.forEach(product => {
//             // Создаем карточку товара
//             const card = document.createElement("div");
//             card.classList.add("product-card");
//
//             card.addEventListener("click", function() {
//                 window.location.href = `/product/${product.id}`;
//             });
//
//
//             // Создаем элемент изображения
//             const imageElement = document.createElement("img");
//             imageElement.classList.add("product-image");
//             imageElement.src = "/img/connection.jpg"; // Изображение по умолчанию
//
//             // Если у продукта есть изображения, загружаем их
//             if (product.fileNames && product.fileNames.length > 0) {
//                 fetch(`product/get/photos?productId=${product.id}`)
//                     .then(response => response.json())
//                     .then(base64Images => {
//                         if (base64Images.length > 0) {
//                             imageElement.src = `data:image/jpeg;base64,${base64Images[0]}`;
//                         }
//                     })
//                     .catch(error => {
//                         console.error('Ошибка при получении изображений:', error);
//                     });
//             }
//
//             // Создаем контейнер для контента карточки
//             const content = document.createElement("div");
//             content.classList.add("product-card-content");
//
//             // Название продукта
//             const nameElement = document.createElement("h3");
//             nameElement.textContent = product.name;
//
//             // Категория или бренд (если нужно)
//             const categoryElement = document.createElement("p");
//             categoryElement.textContent = product.category;
//
//             //id
//             const articleElement = document.createElement("p");
//             articleElement.textContent = product.article;
//
//             // Цена
//             const priceElement = document.createElement("div");
//             priceElement.classList.add("price");
//             priceElement.textContent = product.price + " р";
//
//             // Кнопка "Добавить в корзину"
//             const addToCartButton = document.createElement("button");
//             addToCartButton.type = "button";
//             addToCartButton.classList.add("add-to-cart-btn");
//             addToCartButton.dataset.productId = product.id;
//             addToCartButton.textContent = "Добавить в корзину";
//
//             // Собираем контент карточки
//             content.appendChild(nameElement);
//             content.appendChild(categoryElement);
//             content.appendChild(articleElement)
//             content.appendChild(priceElement);
//             content.appendChild(addToCartButton);
//
//             // Собираем карточку товара
//             card.appendChild(imageElement);
//             card.appendChild(content);
//
//             // productLink.appendChild(card);
//             // Добавляем карточку в сетку продуктов
//             productGrid.appendChild(card);
//         })
//        // checkPaginationButtons( ,parseInt(document.getElementById("totalPages").innerText);
//     }
//
//     function handleEmptyCatalog(isEmpty) {
//         const filterContainer = document.querySelector('.filter-container');
//         const mainCatalog = document.querySelector('.main-catalog');
//         const catalogNav = document.querySelector('.catalog-nav');
//         const pagination = document.querySelector('.pagination');
//
//         if (isEmpty) {
//             filterContainer.style.display = "none";
//             pagination.style.display = "none";
//             mainCatalog.innerHTML = '<p class="catalog-empty">Каталог пуст</p>';
//         } else {
//             filterContainer.style.display = "block";
//             // searchContainer.style.display = "block";
//             // catalogNav.style.display = "block";
//         }
//     }
//
//     function addToCart(productId) {
//         fetch('/basket/add', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ productId: productId })
//         })
//             .then(response => {
//                 if (response.ok) {
//                     alert('Товар добавлен в корзину');
//                 } else {
//                     console.error('Ошибка при добавлении в корзину');
//                 }
//             })
//             .catch(error => {
//                 console.error('Ошибка:', error);
//             });
//     }
//
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
//
//     // Инициализируем загрузку с первой страницы
//     $(document).ready(function() {
//         // Другой код...
//         function updateCatalog(products) {
//             const productGrid = $("#productGrid");
//             productGrid.empty(); // Очищаем текущий список товаров
//
//             products.forEach(product => {
//                 // Создаем карточку товара
//                 const card = $("<div>").addClass("product-card");
//
//                 // Создаем дополнительный блок (прослойку) для кликабельной области
//                 const clickableArea = $("<div>").addClass("clickable-area");
//
//                 // Создаем элемент изображения
//                 const imageElement = $("<img>").addClass("product-image").attr("src", "/img/connection.jpg");
//
//                 // Загрузка изображений продукта (если есть)
//                 if (product.fileNames && product.fileNames.length > 0) {
//                     fetch(`product/get/photos?productId=${product.id}`)
//                         .then(response => response.json())
//                         .then(base64Images => {
//                             if (base64Images.length > 0) {
//                                 imageElement.attr("src", `data:image/jpeg;base64,${base64Images[0]}`);
//                             }
//                         })
//                         .catch(error => {
//                             console.error('Ошибка при получении изображений:', error);
//                         });
//                 }
//
//                 // Создаем контейнер для контента карточки
//                 const content = $("<div>").addClass("product-card-content");
//                 content.addClass("clickableArea")
//
//                 // Название продукта
//                 const nameElement = $("<h3>").text(product.name);
//
//                 // Категория или бренд
//                 const categoryElement = $("<p>").text(product.category);
//
//                 // Артикул
//                 const articleElement = $("<p>").text(product.article);
//
//                 // Цена
//                 const priceElement = $("<div>").addClass("price").text(product.price + " р");
//
//                 // Собираем контент карточки (без кнопки "Добавить в корзину")
//                 content.append(nameElement, categoryElement, articleElement, priceElement);
//
//                 // Собираем кликабельную область
//                 clickableArea.append(imageElement, content);
//
//                 // Привязываем обработчик клика перехода к кликабельной области
//
//
//                 // Кнопка "Добавить в корзину"
//                 const addToCartButton = $("<button>")
//                     .attr("type", "button")
//                     .addClass("add-to-cart-btn")
//                     .attr("data-product-id", product.id)
//                     .text("Добавить в корзину");
//
//                 // Собираем карточку товара, добавляя кликабельную область и кнопку
//                 card.append(clickableArea, addToCartButton);
//
//                 clickableArea.on("click", function() {
//                     window.location.href = `/product/${product.id}`;
//                 });
//
//                 // Добавляем карточку в сетку продуктов
//                 productGrid.append(card);
//             });
//         }
//
//         // Обработчик для кнопки "Добавить в корзину"
//         $(document).on('click', '.add-to-cart-btn', function(e) {
//             e.preventDefault();
//             e.stopPropagation(); // Останавливаем всплытие события
//
//             var button = $(this);
//             var productId = button.data('product-id');
//
//             // Отправляем запрос на сервер для добавления в корзину
//             $.ajax({
//                 url: '/add-to-basket',
//                 method: 'POST',
//                 data: { productId: productId },
//                 success: function(data) {
//                     if (data.result === 'success') {
//                         console.log('Товар успешно добавлен в корзину.');
//                         animateAddToCart(button);
//                     } else {
//                         console.error('Ошибка добавления товара в корзину');
//                     }
//                 },
//                 error: function(error) {
//                     console.error('Произошла ошибка:', error);
//                 }
//             });
//         });
//
//         // Функция для анимации добавления в корзину
//         function animateAddToCart(button) {
//             var animtocart = $('<div class="animtocart"></div>');
//             $('body').append(animtocart);
//
//             var buttonOffset = button.offset();
//
//             animtocart.css({
//                 'position': 'absolute',
//                 'background': '#FBD784',
//                 'width': '25px',
//                 'height': '25px',
//                 'border-radius': '50%',
//                 'z-index': '9999999999',
//                 'left': buttonOffset.left + button.width() / 2 - 12.5,
//                 'top': buttonOffset.top + button.height() / 2 - 12.5,
//             });
//
//             var cart = $('#Busket').offset();
//
//             animtocart.animate({
//                 top: cart.top + 'px',
//                 left: cart.left + 'px',
//                 width: 0,
//                 height: 0
//             }, 800, function() {
//                 $(this).remove();
//             });
//         }
//
//         // Инициализируем загрузку с первой страницы
//         loadProducts(1, true);
//     });
// });


$(document).ready(function() {
    const prevPage = $("#prevPage");
    const currentPageElement = $("#currentPage");
    const nextPage = $("#nextPage");
    const totalPagesElement = $("#totalPages");
    const filterForm = $('#filterForm');
    const resetButton = $('#resetFilters');

    // Event listener for Previous Page button
    prevPage.on("click", function() {
        const currentPage = parseInt(currentPageElement.text(), 10);
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            currentPageElement.text(newPage);
            loadProducts(newPage);
        }
    });

    // Event listener for Next Page button
    nextPage.on("click", function() {
        const currentPage = parseInt(currentPageElement.text(), 10);
        const totalPages = parseInt(totalPagesElement.text(), 10);
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            currentPageElement.text(newPage);
            loadProducts(newPage);
        }
    });

    // Event listener for Filter Form submission
    filterForm.on('submit', function(e) {
        e.preventDefault();
        loadProducts(1);  // Reset to first page when applying filters
    });

    // Event listener for Reset Filters button
    resetButton.on('click', function() {
        $('#brand').val('');
        $('#priceFrom').val('');
        $('#priceTo').val('');
        $('#searchInput').val('');
        loadProducts(1);  // Load products without filters, starting from the first page
    });

    // Function to load products with filters and pagination
    function loadProducts(page = 1) {
        const searchValue = $("#searchInput").val();
        const priceFrom = $('#priceFrom').val() || 0;
        const priceTo = $('#priceTo').val() || 100000000;
        const brand = $('#brand').val();
        const size = 8; // Number of products per page

        const url = `/product/filterproduct?search=${encodeURIComponent(searchValue)}&brand=${encodeURIComponent(brand === 'Выберите бренд' ? '' : brand)}&min=${priceFrom}&max=${priceTo}&page=${page}&size=${size}`;

        $.ajax({
            url: url,
            method: 'GET',
            success: function(data, textStatus, xhr) {
                const totalPages = xhr.getResponseHeader("Total-Pages");
                totalPagesElement.text(totalPages);
                updateCatalog(data);
                checkPaginationButtons(page, parseInt(totalPages, 10));
                if (data.length === 0) {
                    handleEmptyCatalog(true);
                } else {
                    handleEmptyCatalog(false);
                }
                currentPageElement.text(page);
            },
            error: function(error) {
                console.error('Ошибка:', error);
            }
        });
    }

    // Function to update the product catalog
    function updateCatalog(products) {
        const productGrid = $("#productGrid");
        productGrid.empty(); // Clear the current list of products

        products.forEach(product => {
            // Create the product card
            const card = $("<div>").addClass("product-card");

            // Create the clickable area
            const clickableArea = $("<div>").addClass("clickable-area");

            // Create the image element
            const imageElement = $("<img>").addClass("product-image").attr("src", "/img/connection.jpg");

            // Load product images if available
            if (product.fileNames && product.fileNames.length > 0) {
                $.ajax({
                    url: `product/get/photos?productId=${product.id}`,
                    method: 'GET',
                    success: function(base64Images) {
                        if (base64Images.length > 0) {
                            imageElement.attr("src", `data:image/jpeg;base64,${base64Images[0]}`);
                        }
                    },
                    error: function(error) {
                        console.error('Ошибка при получении изображений:', error);
                    }
                });
            }

            // Create the content container
            const content = $("<div>").addClass("product-card-content");

            // Add product details
            const nameElement = $("<h3>").text(product.name);
            const categoryElement = $("<p>").text(product.category);
            const articleElement = $("<p>").text(product.article);
            const priceElement = $("<div>").addClass("price").text(`${product.price} р`);

            // Assemble the content
            content.append(nameElement, categoryElement, articleElement, priceElement);

            // Assemble the clickable area
            clickableArea.append(imageElement, content);

            // Create the "Add to Cart" button
            const addToCartButton = $("<button>")
                .attr("type", "button")
                .addClass("add-to-cart-btn")
                .attr("data-product-id", product.id)
                .text("Добавить в корзину");

            // Assemble the product card
            card.append(clickableArea, addToCartButton);

            // Add click handler to navigate to product page when clicking on clickable area
            clickableArea.on("click", function() {
                window.location.href = `/product/${product.id}`;
            });

            // Append the card to the product grid
            productGrid.append(card);
        });
    }

    // Function to check and update the state of pagination buttons
    function checkPaginationButtons(currentPage, totalPages) {
        if (totalPages <= 1) {
            $(".pagination").hide();
        } else {
            $("#prevPage").toggle(currentPage > 1);
            $("#nextPage").toggle(currentPage < totalPages);
            $(".pagination").show();
        }
    }

    // Function to handle empty catalog display
    function handleEmptyCatalog(isEmpty) {
        const filterContainer = $('.filter-container');
        const mainCatalog = $('.main-catalog');
        const pagination = $('.pagination');

        if (isEmpty) {
            filterContainer.hide();
            pagination.hide();
            mainCatalog.html('<p class="catalog-empty">Каталог пуст</p>');
        } else {
            filterContainer.show();
            mainCatalog.find('.catalog-empty').remove();
        }
    }

    // Event listener for "Add to Cart" button
    $(document).on('click', '.add-to-cart-btn', function(e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent the click from bubbling up to the product card

        const button = $(this);
        const productId = button.data('product-id');

        // Send AJAX request to add the product to the basket
        $.ajax({
            url: '/add-to-basket',
            method: 'POST',
            data: { productId: productId },
            success: function(data) {
                if (data.result === 'success') {
                    console.log('Товар успешно добавлен в корзину.');
                    animateAddToCart(button);
                } else {
                    console.error('Ошибка добавления товара в корзину');
                }
            },
            error: function(error) {
                console.error('Произошла ошибка:', error);
            }
        });
    });

    // Function to animate adding to cart
    function animateAddToCart(button) {
        const animtocart = $('<div class="animtocart"></div>');
        $('body').append(animtocart);

        const buttonOffset = button.offset();

        animtocart.css({
            'position': 'absolute',
            'background': '#FBD784',
            'width': '25px',
            'height': '25px',
            'border-radius': '50%',
            'z-index': '9999999999',
            'left': buttonOffset.left + button.width() / 2 - 12.5,
            'top': buttonOffset.top + button.height() / 2 - 12.5,
        });

        const cart = $('#Busket').offset();

        animtocart.animate({
            top: cart.top + 'px',
            left: cart.left + 'px',
            width: 0,
            height: 0
        }, 800, function() {
            $(this).remove();
        });
    }

    // Initialize by loading the first page of products
    loadProducts(1);
});

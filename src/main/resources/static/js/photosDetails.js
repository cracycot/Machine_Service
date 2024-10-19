document.addEventListener("DOMContentLoaded", function () {

    // Функция для получения ID товара со страницы
    function getProductIdFromPage() {
        return document.getElementById("productId").innerText.trim();
    }

    function loadProductDetails(productId) {
        if (!productId) {
            console.error('Product ID не найден на странице');
            return;
        }

        // Запрос деталей продукта и изображений
        fetch(`getproduct?id=${productId}`)
            .then(response => response.json())
            .then(product => {
                console.log(product);
                displayProductDetails(product);
            })
            .catch(error => console.error('Ошибка при загрузке деталей продукта:', error));
    }

    function displayProductDetails(product) {
        // Заполнение информации о товаре
        document.querySelector(".product-name").textContent = product.name;
        document.querySelector(".product-category").textContent = `Категория: ${product.category}`;
        document.querySelector(".product-article").textContent = `Артикул: ${product.article}`;
        document.querySelector(".product-description").textContent = product.description;
        document.querySelector(".product-price").textContent = `Цена: ${product.price} р`;
        document.querySelector(".product-availability").textContent = `В наличии: ${product.inStock} шт.`;

        // Кнопка "Добавить в корзину"
        const addToCartButton = document.querySelector(".add-to-cart-btn1");
        addToCartButton.dataset.productId = product.id;

        // Загрузка изображений в слайдер
        const swiperWrapper = document.querySelector(".swiper-wrapper");

        if (product.fileNames && product.fileNames.length > 0) {
            fetch(`get/photos?productId=${product.id}`)
                .then(response => response.json())
                .then(base64Images => {
                    base64Images.forEach(base64Image => {
                        const swiperSlide = document.createElement("div");
                        swiperSlide.classList.add("swiper-slide");

                        const img = document.createElement("img");
                        img.src = `data:image/jpeg;base64,${base64Image}`;
                        img.alt = product.name;

                        swiperSlide.appendChild(img);
                        swiperWrapper.appendChild(swiperSlide);
                    });

                    // Инициализация Swiper после загрузки изображений
                    initializeSwiper();
                })
                .catch(error => {
                    console.error('Ошибка при получении изображений:', error);
                    // Инициализируем Swiper даже если загрузка изображений не удалась
                    initializeSwiper();
                });
        } else {
            // Если изображений нет, добавляем заглушку
            const swiperSlide = document.createElement("div");
            swiperSlide.classList.add("swiper-slide");

            const img = document.createElement("img");
            img.src = `/img/no-image.png`; // Путь к заглушке
            img.alt = "Изображение не доступно";

            swiperSlide.appendChild(img);
            swiperWrapper.appendChild(swiperSlide);

            initializeSwiper();
        }
    }

    function initializeSwiper() {
        new Swiper('.swiper-container', {
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
        });
    }

    // Получаем ID товара и загружаем его данные
    const productId = getProductIdFromPage();
    loadProductDetails(productId);
});

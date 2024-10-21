document.addEventListener("DOMContentLoaded", function () {
    // Получаем модальное окно
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");

    // Функция для открытия изображения в модальном окне
    function openImageModal(img) {
        modal.style.display = "block";
        modalImage.src = img.src; // Устанавливаем путь к изображению
        captionText.innerHTML = img.alt; // Устанавливаем описание
    }

    // Закрытие модального окна при нажатии на "X"
    const closeModal = document.getElementsByClassName("close-modal")[0];
    closeModal.onclick = function () {
        modal.style.display = "none";
    };

    // Закрытие модального окна при клике вне изображения
    modal.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Функция для загрузки деталей продукта
    function loadProductDetails(productId) {
        if (!productId) {
            console.error('Product ID не найден на странице');
            return;
        }

        // Запрос на сервер для получения деталей продукта
        fetch(`getproduct?id=${productId}`)
            .then(response => response.json())
            .then(product => {
                displayProductDetails(product);
            })
            .catch(error => console.error('Ошибка при загрузке деталей продукта:', error));
    }

    // Функция для отображения деталей продукта
    function displayProductDetails(product) {
        // Заполняем информацию о товаре
        document.querySelector(".product-name").textContent = product.name;
        document.querySelector(".product-category").textContent = `Категория: ${product.category}`;
        document.querySelector(".product-article").textContent = `Артикул: ${product.article}`;
        document.querySelector(".product-description").textContent = product.description;
        document.querySelector(".product-price").textContent = `Цена: ${product.price} р`;
        document.querySelector(".product-availability").textContent = `В наличии: ${product.inStock} шт.`;



        // Загрузка изображений в слайдер
        const swiperWrapper = document.querySelector(".swiper-wrapper");
        swiperWrapper.innerHTML = ""; // Очищаем старые слайды

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

                        // Добавляем обработчик для открытия изображения в модальном окне
                        img.addEventListener('click', function () {
                            openImageModal(img);
                        });

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


        // Кнопка "Добавить в корзину"
        const addToCartButton = document.querySelector(".add-to-cart-btn1");
        addToCartButton.dataset.productId = product.id;

        // Обработчик для добавления товара в корзину
        addToCartButton.addEventListener('click', function(e) {
            e.preventDefault();
            addToCart(product.id);
            animateAddToCart(addToCartButton); // Анимация добавления в корзину
        });
    }

    // Инициализация Swiper слайдера
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

    function addToCart(productId) {
        fetch('/add-to-basket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ productId: productId })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Товар добавлен в корзину');
                } else {
                    console.error('Ошибка при добавлении в корзину');
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    }


    // Анимация добавления в корзину
    function animateAddToCart(button) {
        const animtocart = document.createElement("div");
        animtocart.classList.add("animtocart");
        document.body.appendChild(animtocart);

        const buttonRect = button.getBoundingClientRect();
        animtocart.style.position = 'absolute';
        animtocart.style.background = '#FBD784';
        animtocart.style.width = '25px';
        animtocart.style.height = '25px';
        animtocart.style.borderRadius = '50%';
        animtocart.style.zIndex = '9999999999';
        animtocart.style.left = buttonRect.left + (button.offsetWidth / 2) - 12.5 + 'px';
        animtocart.style.top = buttonRect.top + (button.offsetHeight / 2) - 12.5 + 'px';

        const cartIcon = document.getElementById('Busket').getBoundingClientRect();

        animtocart.animate({
            top: cartIcon.top + 'px',
            left: cartIcon.left + 'px',
            width: '0px',
            height: '0px'
        }, {
            duration: 800,
            easing: 'ease-out',
            fill: 'forwards'
        }).onfinish = function () {
            animtocart.remove();
        };
    }

    // Получаем ID товара со страницы и загружаем его данные
    const productId = document.getElementById("productId").innerText.trim();
    loadProductDetails(productId);
});

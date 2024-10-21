// document.addEventListener('DOMContentLoaded', function() {
//     var addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
//
//     addToCartButtons.forEach(function(button) {
//         button.addEventListener('click', function(ev) {
//             var productId = this.getAttribute('product-article');
//             console.log(productId)
//
//             fetch('/add-to-basket', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                     // Добавьте этот заголовок, если CSRF токен требуется
//                     // 'X-CSRF-TOKEN': csrfToken
//                 },
//                 body: 'productId=' + productId
//             })
//                 .then(response => {
//                     if (!response.ok) {
//                         throw new Error('Network response was not ok');
//                     }
//                     return response.json(); // предполагаем, что сервер возвращает JSON
//                 })
//                 .then((data) => {
//                     if(data.result === 'success') {
//                         console.log('Товар успешно добавлен в корзину.');
//                         // Здесь может быть код для обновления интерфейса пользователя
//                     } else {
//                         console.error('Ошибка добавления товара в корзину');
//                         // Обработать ситуацию ошибки
//                     }
//                 })
//                 .catch((error) => {
//                     console.error('Произошла ошибка:', error);
//                 });
//         });
//     });
// });

// document.addEventListener('DOMContentLoaded', function () {
//     // Предполагаем, что container - это родительский элемент, который уже есть на странице.
//     var container = document.querySelector('#container'); // Пример с использованием тега body как контейнера для делегирования
//
//     container.addEventListener('click', function (event) {
//         // Используем метод closest, чтобы проверить, была ли нажата кнопка добавить в корзину или ее потомок
//         var button = event.target.closest('.add-to-cart-btn');// Если нажатый элемент или его потомки не являются целевой кнопкой, прекращаем выполнение функции
//         if (!button) return;
//
//         // Получаем productId из атрибута product-article нажатой кнопки
//         var productId = button.getAttribute('data-product-id');
//         console.log(productId);
//
//         // Остальная часть кода по выполнению запроса к серверу остается без изменений
//         fetch('/add-to-basket', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 // Добавьте этот заголовок, если CSRF токен требуется
//                 // 'X-CSRF-TOKEN': csrfToken
//             },
//             body: 'productId=' + productId
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then((data) => {
//                 if (data.result === 'success') {
//
//                     // showAddToBasketModal()
//                     console.log('Товар успешно добавлен в корзину.');
//                 } else {
//                     console.error('Ошибка добавления товара в корзину');
//                 }
//             })
//             .catch((error) => {
//                 console.error('Произошла ошибка:', error);
//             });
//     });
// });
//
// function closeProductModal() {
//     document.getElementById("productModal").style.display = "none";
// }
//
// $(document).on('click', '.add-to-cart-btn', function(e){
//     e.preventDefault();
//     console.log('Клик по кнопке "Добавить в корзину"');
//
//     var button = $(this);
//     var productId = button.data('product-id');
//
//     // Отправляем запрос на сервер для добавления в корзину
//     $.ajax({
//         url: '/add-to-basket',
//         method: 'POST',
//         data: { productId: productId },
//         success: function(data) {
//             if (data.result === 'success') {
//                 console.log('Товар успешно добавлен в корзину.');
//                 // Запускаем анимацию
//                 animateAddToCart(button);
//             } else {
//                 console.error('Ошибка добавления товара в корзину');
//             }
//         },
//         error: function(error) {
//             console.error('Произошла ошибка:', error);
//         }
//     });
// });
//
// function animateAddToCart(button) {
//     var animtocart = $('<div class="animtocart"></div>');
//     $('body').append(animtocart);
//
//     var buttonOffset = button.offset();
//
//     animtocart.css({
//         'position' : 'absolute',
//         'background' : '#FBD784',
//         'width' : '25px',
//         'height' : '25px',
//         'border-radius' : '50%',
//         'z-index' : '9999999999',
//         'left' : buttonOffset.left + button.width() / 2 - 12.5,
//         'top' : buttonOffset.top + button.height() / 2 - 12.5,
//     });
//
//     var cart = $('#Busket').offset();
//
//     animtocart.animate({
//         top: cart.top + 'px',
//         left: cart.left + 'px',
//         width: 0,
//         height: 0
//     }, 800, function(){
//         $(this).remove();
//     });
// }
//
// $(document).on('click', '.add-to-cart-btn', function(e){
//     e.preventDefault();
//     e.stopPropagation(); // Останавливаем распространение события
//     console.log('Клик по кнопке "Добавить в корзину"');
//
//     var button = $(this);
//     var productId = button.data('product-id');
//
//     // Отправляем запрос на сервер для добавления в корзину
//     $.ajax({
//         url: '/add-to-basket',
//         method: 'POST',
//         data: { productId: productId },
//         success: function(data) {
//             if (data.result === 'success') {
//                 console.log('Товар успешно добавлен в корзину.');
//                 // Запускаем анимацию
//                 animateAddToCart(button);
//             } else {
//                 console.error('Ошибка добавления товара в корзину');
//             }
//         },
//         error: function(error) {
//             console.error('Произошла ошибка:', error);
//         }
//     });
// });
//
// function animateAddToCart(button) {
//     var animtocart = $('<div class="animtocart"></div>');
//     $('body').append(animtocart);
//
//     var buttonOffset = button.offset();
//
//     animtocart.css({
//         'position' : 'absolute',
//         'background' : '#FBD784',
//         'width' : '25px',
//         'height' : '25px',
//         'border-radius' : '50%',
//         'z-index' : '9999999999',
//         'left' : buttonOffset.left + button.width() / 2 - 12.5,
//         'top' : buttonOffset.top + button.height() / 2 - 12.5,
//     });
//
//     var cart = $('#Busket').offset();
//
//     animtocart.animate({
//         top: cart.top + 'px',
//         left: cart.left + 'px',
//         width: 0,
//         height: 0
//     }, 800, function(){
//         $(this).remove();
//     });
// }
//

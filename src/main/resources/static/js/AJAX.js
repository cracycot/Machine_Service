document.addEventListener('DOMContentLoaded', function() {
    var addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var productId = this.getAttribute('data-product-id');

            fetch('/add-to-basket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // Добавьте этот заголовок, если CSRF токен требуется
                    // 'X-CSRF-TOKEN': csrfToken
                },
                body: 'productId=' + productId
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // предполагаем, что сервер возвращает JSON
                })
                .then((data) => {
                    if(data.result === 'success') {
                        console.log('Товар успешно добавлен в корзину.');
                        // Здесь может быть код для обновления интерфейса пользователя
                    } else {
                        console.error('Ошибка добавления товара в корзину');
                        // Обработать ситуацию ошибки
                    }
                })
                .catch((error) => {
                    console.error('Произошла ошибка:', error);
                });
        });
    });
});
// document.addEventListener('DOMContentLoaded', function(){
//     document.getElementById('searchButton').addEventListener('click', function(){
//         var searchValue = document.getElementById('searchInput').value;
//         fetch('/product/searchproduct?id=' + searchValue)
//             .then(response => response.text())
//             .then(data => {
//                 document.getElementById('results').innerHTML = data;
//             })
//             .catch(error => console.error(error));
//     });
// });
// // Не забудьте объявить переменную csrfToken в вашем коде или получить её значение из метатегов или скрытого input поля
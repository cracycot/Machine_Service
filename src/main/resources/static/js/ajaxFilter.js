document.addEventListener('DOMContentLoaded', function () {
    var searchForm = document.getElementById('searchForm');
    var searchInput = document.getElementById('searchInput');
    var itemsList = document.getElementById('itemsList');
    var currentPage = document.getElementById('currentPage');

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        fetchItems(searchInput.value, Math.max(1, parseInt(currentPage.innerText, 10)));
    });

    function fetchItems(searchQuery, page) {
        // Обращение к серверу за данными.
        // Предполагается, что сервер принимает page и searchQuery как GET параметры
        // и возвращает JSON с элементами и информацией о странице.

        fetch(`/product/searchproduct?page=${page}&search=${searchQuery}`)
    .then(response => response.json())
            .then(data => {
                renderItems(data.items);
                updatePagination(Math.max(1,data.page));
            });
    }

    function renderItems(items) {
        itemsList.innerHTML = ''; // Очистка текущего содержимого списка
        items.forEach(item => {
            var li = document.createElement('li');
            li.textContent = item.name;
            itemsList.appendChild(li);

            // Добавляем кнопку 'Добавить в корзину'
            var button = document.createElement('button');
            button.textContent = 'Добавить в корзину';
            button.className = 'add-to-cart-btn';
            button.setAttribute('data-product-id', item.id);
            button.addEventListener('click', function() {
                // Логика добавления в корзину
            });
            li.appendChild(button);
        });
    }

    function updatePagination(page) {
        // Обновление информации о страницах и пагинации
        currentPage.innerText = page.number;
        document.getElementById('prevPage').style.display = page.number > 1 ? 'inline-block' : 'none';
        document.getElementById('nextPage').style.display = page.number < page.totalPages ? 'inline-block' : 'none';
    }

    // Загрузка начального списка элементов
    fetchItems('', 1);
});
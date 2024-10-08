document.addEventListener('DOMContentLoaded', function () {
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);

            // Получаем все файлы изображений
            const files = document.getElementById('images').files;
            const imageUrls = [];

            // Загружаем изображения на сервер
            for (const file of files) {
                const imageFormData = new FormData();
                imageFormData.append('file', file);
                imageFormData.append('fileName', file.name);

                try {
                    const response = await fetch('/upload', {
                        method: 'POST',
                        body: imageFormData
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("фото отправлено")
                        imageUrls.push(data.url); // Добавляем полученный URL в список
                    } else {
                        console.error('Ошибка загрузки изображения', response.statusText);
                    }
                } catch (error) {
                    console.error('Ошибка загрузки изображения', error);
                }
            }

            // Добавляем URL-адреса изображений в данные продукта
            formData.append('imageUrls', JSON.stringify(imageUrls));

            // Отправляем данные продукта на сервер
            try {
                const response = await fetch('/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });

                if (response.ok) {
                    alert('Продукт успешно добавлен');
                    window.location.reload();
                } else {
                    console.error('Ошибка создания продукта', response.statusText);
                }
            } catch (error) {
                console.error('Ошибка создания продукта', error);
            }
        });
    } else {
        console.error('Форма с id="productForm" не найдена');
    }
});

// document.addEventListener('DOMContentLoaded', function () {
//     const productForm = document.getElementById('productForm');
//     if (productForm) {
//         productForm.addEventListener('submit', async function(event) {
//             event.preventDefault();
//
//             const form = event.target;
//             const formData = new FormData(form);
//
//             // Получаем все файлы изображений
//             const files = document.getElementById('images').files;
//             const imageUrls = [];
//
//             // Загружаем изображения на сервер
//             for (const file of files) {
//                 const imageFormData = new FormData();
//                 imageFormData.append('file', file);
//                 imageFormData.append('fileName', file.name);
//
//                 try {
//                     const response = await fetch('/upload', {
//                         method: 'POST',
//                         body: imageFormData
//                     });
//
//                     if (response.ok) {
//                         const data = await response.json();
//                         console.log("фото отправлено")
//                         imageUrls.push(data.url); // Добавляем полученный URL в список
//                     } else {
//                         console.error('Ошибка загрузки изображения', response.statusText);
//                     }
//                 } catch (error) {
//                     console.error('Ошибка загрузки изображения', error);
//                 }
//             }
//
//             // Добавляем URL-адреса изображений в данные продукта
//             formData.append('imageUrls', JSON.stringify(imageUrls));
//
//             // Отправляем данные продукта на сервер
//             try {
//                 const response = await fetch('/create', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(Object.fromEntries(formData))
//                 });
//
//                 if (response.ok) {
//                     alert('Продукт успешно добавлен');
//                     window.location.reload();
//                 } else {
//                     console.error('Ошибка создания продукта', response.statusText);
//                 }
//             } catch (error) {
//                 console.error('Ошибка создания продукта', error);
//             }
//         });
//     } else {
//         console.error('Форма с id="productForm" не найдена');
//     }
// });
// document.addEventListener('DOMContentLoaded', function () {
//     const productForm = document.getElementById('productForm');
//     if (productForm) {
//         productForm.addEventListener('submit', async function(event) {
//             event.preventDefault();
//
//             const form = event.target;
//             const formData = new FormData(form);
//
//             // Получаем все файлы изображений
//             const files = document.getElementById('images').files;
//
//             // Добавляем все файлы в formData под одним именем 'files'
//             console.log(files.length);
//             for (let i = 0; i < files.length; i++) {
//                 formData.append('files', files[i]);
//             }
//
//             // Отправляем данные продукта и файлы на сервер
//             try {
//                 const response = await fetch('/product/create', {
//                     method: 'POST',
//                     body: formData
//                 });
//
//                 if (response.ok) {
//                     alert('Продукт успешно добавлен');
//                     window.location.reload();
//                 } else {
//                     console.error('Ошибка создания продукта', response.statusText);
//                 }
//             } catch (error) {
//                 console.error('Ошибка создания продукта', error);
//             }
//         });
//     } else {
//         console.error('Форма с id="productForm" не найдена');
//     }
// });

document.addEventListener('DOMContentLoaded', function () {
    const productForm = document.getElementById('productForm');
    const addImageButton = document.getElementById('addImageButton');
    const fileInputsContainer = document.getElementById('fileInputsContainer');

    if (addImageButton) {
        addImageButton.addEventListener('click', function() {
            const newFileInput = document.createElement('input');
            newFileInput.type = 'file';
            newFileInput.name = 'images';
            newFileInput.className = 'image-input';
            newFileInput.accept = 'image/*';
            fileInputsContainer.appendChild(newFileInput);
        });
    }

    if (productForm) {
        productForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const formData = new FormData();

            // Собираем все данные из формы, кроме файлов
            const inputs = productForm.querySelectorAll('input[name]:not([type="file"]), select[name]');
            inputs.forEach(input => {
                formData.append(input.name, input.value);
            });

            // Собираем все файлы
            const fileInputs = productForm.querySelectorAll('.image-input');
            fileInputs.forEach(fileInput => {
                if (fileInput.files[0]) {
                    console.log(fileInput.files[0])
                    formData.append('files', fileInput.files[0]);
                }
            });

            // Отправляем данные продукта и файлы на сервер
            try {
                const response = await fetch('/product/create', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    alert('Продукт успешно добавлен');
                    window.location.reload();
                } else {
                    console.error('Ошибка создания продукта', response.statusText);
                    const errorData = await response.text();
                    console.error('Детали ошибки:', errorData);
                }
            } catch (error) {
                console.error('Ошибка создания продукта', error);
            }
        });
    } else {
        console.error('Форма с id="productForm" не найдена');
    }
});


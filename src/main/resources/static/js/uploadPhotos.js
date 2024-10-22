document.addEventListener('DOMContentLoaded', function () {
    const productForm = document.getElementById('productForm');
    const addImageButton = document.getElementById('addImageButton');
    const fileInputsContainer = document.getElementById('fileInputsContainer');

    if (addImageButton) {
        addImageButton.addEventListener('click', function() {
            const newFileInputWrapper = document.createElement('div');
            newFileInputWrapper.className = 'file-input-wrapper';

            const newFileInput = document.createElement('input');
            newFileInput.type = 'file';
            newFileInput.name = 'images';
            newFileInput.className = 'image-input';
            newFileInput.accept = 'image/*';
            newFileInput.style.display = 'none'; // Поле загрузки файла скрыто
            newFileInputWrapper.appendChild(newFileInput);

            const customButton = document.createElement('button');
            customButton.type = 'button';
            customButton.textContent = 'Выбрать фото';
            customButton.className = 'custom-select-button';
            customButton.onclick = function() {
                newFileInput.click(); // Открываем диалог выбора файла
            };
            newFileInputWrapper.appendChild(customButton);

            const fileNameLabel = document.createElement('span');
            fileNameLabel.textContent = 'Файл не выбран';
            fileNameLabel.className = 'file-name-label';
            newFileInputWrapper.appendChild(fileNameLabel);

            // Обработчик изменения для отображения имени файла
            newFileInput.addEventListener('change', function() {
                if (newFileInput.files.length > 0) {
                    fileNameLabel.textContent = newFileInput.files[0].name;

                    const removeButton = document.createElement('button');
                    removeButton.type = 'button';
                    removeButton.className = 'remove-image-button';
                    removeButton.textContent = 'Удалить';
                    removeButton.onclick = function() {
                        removeImageInput(newFileInputWrapper);
                    };

                    // Добавляем кнопку удаления справа от имени файла
                    if (!newFileInputWrapper.contains(removeButton)) {
                        fileNameLabel.insertAdjacentElement('afterend', removeButton);
                    }
                }
            });

            fileInputsContainer.appendChild(newFileInputWrapper);
        });
    }

    // Функция для удаления выбранного файла
    window.removeImageInput = function (wrapper) {
        wrapper.remove();
    };

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
                if (input.name === 'condition') {
                    formData.append(input.name, input.value === 'newCondition');
                } else {
                    formData.append(input.name, input.value);
                }
            });

            // Собираем все файлы
            const fileInputs = productForm.querySelectorAll('.image-input');
            let fileUploaded = false;
            fileInputs.forEach(fileInput => {
                if (fileInput.files[0]) {
                    formData.append('files', fileInput.files[0]);
                    console.log(fileInput.files[0], fileInput.files)
                    fileUploaded = true;
                }
            });
            // Если не было загружено ни одного файла, добавляем дефолтное изображение
            if (!fileUploaded) {
                try {
                    const defaultImageResponse = await fetch('/img/connection.jpg');
                    const defaultImageBlob = await defaultImageResponse.blob();
                    const defaultFile = new File([defaultImageBlob], 'connection.jpg', { type: defaultImageBlob.type });
                    formData.append('files', defaultFile); // Просто добавляем defaultFile без попытки обращаться к files[0]
                    console.log(defaultFile); // Логируем объект файла
                } catch (error) {
                    console.error('Ошибка при загрузке дефолтного изображения', error);
                    alert('Не удалось загрузить дефолтное изображение');
                    return;
                }
            }
            const loadingSpinner = document.getElementById('loadingSpinner');

            // Отправляем данные продукта и файлы на сервер
            try {
                loadingSpinner.style.display = 'block';
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
            } finally {
                loadingSpinner.style.display = 'none';
            }
        });
    } else {
        console.error('Форма с id="productForm" не найдена');
    }
});


document.querySelector(".SendForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Остановка стандартной отправки формы
    const formData = new FormData(this);
    showLoadingSpinner()
    fetch('/Sendform', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            hideLoadingSpinner()
            if (response.ok) {
                showFormModal("success")
            } else {
                showFormModal("Произошла ошибка, попробуйте позднее")
                alert('Произошла ошибка при отправке заявки.');
            }
        })
        .catch(error => console.error('Ошибка:', error));
});

function showLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';
}

function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'none';
}

function showFormModal(status) {
    const formModal = document.getElementById('formModal');

    if (!formModal) {
        console.error('Модальное окно не найдено');
        return;
    }
    const modalContent = formModal.querySelector('.modal-content p')
    if (!modalContent) {
        console.error('Элемент для отображения сообщения не найден');
        return;
    }

    if (status === 'success') {
        console.log("успех")
        modalContent.textContent = 'Ваш заказ успешно отправлен!';
    } else {
        modalContent.textContent = 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.';
    }

    formModal.style.display = 'block';
    // Закрываем модальное окно через 5 секунд
    setTimeout(() => {
        formModal.style.display = 'none';

        // Если заказ успешно отправлен, перенаправляем пользователя на главную страницу
        if (status === 'success') {
            window.location.href = '/';
        }
    }, 2500);
}


// Функция для закрытия модального окна вручную (если у вас есть кнопка закрытия)
function closeModal() {
    const orderModal = document.getElementById('orderModal');
    orderModal.style.display = 'none';

    // Если заказ успешно отправлен, перенаправляем пользователя на главную страницу
    if (orderModal.querySelector('.modal-content p').textContent.includes('успешно')) {
        window.location.href = '/';
    }
}
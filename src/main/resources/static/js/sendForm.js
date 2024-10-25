// document.querySelector(".SendForm").addEventListener("submit", function(event) {
//     event.preventDefault(); // Остановка стандартной отправки формы
//     const formData = new FormData(this);
//     showLoadingSpinner()
//     fetch('/Sendform', {
//         method: 'POST',
//         body: formData
//     })
//         .then(response => {
//             hideLoadingSpinner()
//             if (response.ok) {
//                 showFormModal("success")
//             } else {
//                 showFormModal("Произошла ошибка, попробуйте позднее")
//                 alert('Произошла ошибка при отправке заявки.');
//             }
//         })
//         .catch(error => console.error('Ошибка:', error));
// });
// document.querySelector(".SendForm").addEventListener("submit", function(event) {
//     event.preventDefault(); // Остановка стандартной отправки формы
//     const formData = new FormData(this);
//
//     // Очистка предыдущих ошибок
//     document.querySelectorAll('.error').forEach(function(errorDiv) {
//         errorDiv.textContent = '';
//     });
//
//     showLoadingSpinner();
//
//     fetch('/Sendform', {
//         method: 'POST',
//         body: formData
//     })
//         .then(response => {
//             if (response.ok) {
//                 hideLoadingSpinner();
//                 showFormModal("success");
//             } else if (response.status === 400) {
//                 // Обработка ошибок валидации
//                 hideLoadingSpinner();
//                 response.json().then(errors => {
//                     for (let field in errors) {
//                         let errorDiv = document.getElementById(field + 'Error');
//                         if (errorDiv) {
//                             errorDiv.textContent = errors[field];
//                         }
//                     }
//                 });
//             } else {
//                 hideLoadingSpinner();
//                 showFormModal("Произошла ошибка, попробуйте позднее");
//                 alert('Произошла ошибка при отправке заявки.');
//             }
//         })
//         .catch(error => {
//             hideLoadingSpinner();
//             console.error('Ошибка:', error);
//             showFormModal("Произошла ошибка, попробуйте позднее");
//         });
// });
//
//
// function showLoadingSpinner() {
//     const loadingSpinner = document.getElementById('loadingSpinner');
//     loadingSpinner.style.display = 'block';
// }
//
// function hideLoadingSpinner() {
//     const loadingSpinner = document.getElementById('loadingSpinner');
//     loadingSpinner.style.display = 'none';
// }
//
// function showFormModal(status) {
//     const formModal = document.getElementById('formModal');
//
//     if (!formModal) {
//         console.error('Модальное окно не найдено');
//         return;
//     }
//     const modalContent = formModal.querySelector('.modal-content p')
//     if (!modalContent) {
//         console.error('Элемент для отображения сообщения не найден');
//         return;
//     }
//
//     if (status === 'success') {
//         console.log("успех")
//         modalContent.textContent = 'Ваш заказ успешно отправлен!';
//     } else {
//         modalContent.textContent = 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.';
//     }
//
//     formModal.style.display = 'block';
//     // Закрываем модальное окно через 5 секунд
//     setTimeout(() => {
//         formModal.style.display = 'none';
//
//         // Если заказ успешно отправлен, перенаправляем пользователя на главную страницу
//         if (status === 'success') {
//             window.location.href = '/';
//         }
//     }, 2500);
// }
//
//
// // Функция для закрытия модального окна вручную (если у вас есть кнопка закрытия)
// function closeModal() {
//     const orderModal = document.getElementById('orderModal');
//     orderModal.style.display = 'none';
//
//     // Если заказ успешно отправлен, перенаправляем пользователя на главную страницу
//     if (orderModal.querySelector('.modal-content p').textContent.includes('успешно')) {
//         window.location.href = '/';
//     }
// }

document.querySelector(".SendForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Остановка стандартной отправки формы
    const formData = new FormData(this);

    // Очистка предыдущих ошибок
    document.querySelectorAll('.error').forEach(function(errorDiv) {
        errorDiv.textContent = '';
    });

    // Клиентская валидация
    if (!validateForm(formData)) {
        // Если есть ошибки валидации, не отправляем форму
        return;
    }

    showLoadingSpinner();

    fetch('/Sendform', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                hideLoadingSpinner();
                showFormModal("success");
            } else if (response.status === 400) {
                // Обработка ошибок валидации от сервера
                hideLoadingSpinner();
                response.json().then(errors => {
                    for (let field in errors) {
                        let errorDiv = document.getElementById(field + 'Error');
                        if (errorDiv) {
                            errorDiv.textContent = errors[field];
                        }
                    }
                });
            } else {
                hideLoadingSpinner();
                showFormModal("Произошла ошибка, попробуйте позднее");
                alert('Произошла ошибка при отправке заявки.');
            }
        })
        .catch(error => {
            hideLoadingSpinner();
            console.error('Ошибка:', error);
            showFormModal("Произошла ошибка, попробуйте позднее");
        });
});

// Функция для валидации формы на клиенте
function validateForm(formData) {
    let hasErrors = false;

    // Валидация имени
    const name = formData.get('name').trim();
    if (name.length === 0) {
        document.getElementById('nameError').textContent = 'Введите Ваше имя';
        hasErrors = true;
    } else if (name.length < 2 || name.length > 25) {
        document.getElementById('nameError').textContent = 'Имя должно быть больше 2 и меньше 25 букв';
        hasErrors = true;
    }

    // Валидация номера телефона
    const phoneNumber = formData.get('phoneNumber').trim();
    if (phoneNumber.length === 0) {
        document.getElementById('phoneNumberError').textContent = 'Введите номер телефона';
        hasErrors = true;
    } else if (!/^\+?\d{10,15}$/.test(phoneNumber)) {
        document.getElementById('phoneNumberError').textContent = 'Введите корректный номер телефона';
        hasErrors = true;
    }

    // Валидация почты
    const email = formData.get('email').trim();
    if (email.length === 0) {
        document.getElementById('emailError').textContent = 'Введите Вашу почту';
        hasErrors = true;
    } else if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = 'Некорректный формат электронной почты';
        hasErrors = true;
    }

    // Валидация описания проблемы
    const description = formData.get('description').trim();
    if (description.length === 0) {
        document.getElementById('descriptionError').textContent = 'Пожалуйста, опишите проблему';
        hasErrors = true;
    }

    // Добавьте валидацию для других полей, если необходимо

    return !hasErrors; // Возвращаем true, если ошибок нет
}

// Вспомогательная функция для проверки корректности email
function validateEmail(email) {
    // Простая проверка email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Остальной код остается без изменений...

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
    // Закрываем модальное окно через 2.5 секунды
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

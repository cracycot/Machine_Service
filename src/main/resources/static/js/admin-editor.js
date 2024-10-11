function deleteProduct(button) {
    if (!confirm('Вы уверены, что хотите удалить этот продукт?')) {
        return;
    }
    var productId = button.closest('tr').querySelector('.data-id').innerText;
    console.log(productId);
    fetch(`/product/deleteproduct?id=${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if(response.ok) {
                window.location.reload();
            } else {
                alert('Ошибка при удалении продукта');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}
async function increaseStock(button) {
    const productId = button.closest('tr').querySelector('.data-id').innerText;
    try {
        const response = await fetch(`/product/increaseStock?id=${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            const data = await response.json();
            // Обновляем отображение количества на складе
            const stockQuantity = button.closest('tr').querySelector('.stock-quantity');
            stockQuantity.innerText = data.newStock;
        } else {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.message}`);
        }
        // Остальной код
    } catch (error) {
        console.error('Ошибка:', error);
    }
}


async function decreaseStock(button) {
    const productId = button.closest('tr').querySelector('.data-id').innerText;
    try {

        const response = await fetch(`/product/decreaseStock?id=${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            const data = await response.json();
            // Обновляем отображение количества на складе
            const stockQuantity = button.closest('tr').querySelector('.stock-quantity');
            stockQuantity.innerText = data.newStock;
        } else {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Обработчик отправки формы для создания нового продукта
// document.querySelector('form').addEventListener('submit', async function(event) {
//     event.preventDefault();
//
//     const formData = new FormData(this);
//     const product = {
//         name: formData.get('name'),
//         category: formData.get('category'),
//         article: formData.get('article'),
//         price: parseFloat(formData.get('price')),
//         inStock: parseInt(formData.get('inStock'))
//     };
//
//     try {
//         const response = await fetch('/product/create', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(product)
//         });
//
//         if (response.ok) {
//             alert('Продукт сохранен');
//             window.location.reload(); // Перезагрузим страницу, чтобы отобразить новый продукт
//         } else {
//             alert('Ошибка при сохранении продукта');
//         }
//     } catch (error) {
//         console.error('Ошибка:', error);
//     }
// });

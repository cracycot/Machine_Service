// document.addEventListener('DOMContentLoaded', function () {
//     // Определение элементов карусели
//     const carouselItemsContainer = document.querySelector('.carousel-items');
//     const carouselItems = document.querySelectorAll('.carousel-item');
//     const totalSlides = carouselItems.length;
//     let currentIndex = 0; // Индекс текущего слайда
//
//     // Инициализация первого слайда
//     carouselItems[currentIndex].classList.add('active');
//
//     // Функция обновления текущего слайда
//     function updateActiveSlide(newIndex) {
//         // Удаляем класс 'active' у всех слайдов
//         carouselItems.forEach(item => item.classList.remove('active'));
//         let i = newIndex > 0 ? newIndex - 1 : carouselItems.length - 1;
//         carouselItems[i].style.display = "flex";
//         carouselItems[i].style.transition = "transform 3.5s ease";
//         // Добавляем класс 'active' к текущему слайду
//         carouselItems[newIndex].classList.add('active');
//     }
//
//     // Функция перехода к следующему слайду
//     function moveToNextSlide() {
//         currentIndex = (currentIndex + 1) % totalSlides;
//         updateActiveSlide(currentIndex);
//     }
//
//     // Установка интервала автоматической прокрутки слайдов
//     setInterval(moveToNextSlide, 6000); // 3000ms = 3 секунды
//
//     // Инициализация AOS (Animate On Scroll)
//     AOS.init();
// });
// Подключаем Swiper
// const swiper = new Swiper('.swiper-container', {
//     // Параметры Swiper
//     direction: 'horizontal', // Вертикальный или горизонтальный
//     loop: true, // Бесконечная прокрутка
//
//     // Если нужна пагинация
//     pagination: {
//         el: '.swiper-pagination',
//     },
//
//     // Навигационные кнопки
//     navigation: {
//         nextEl: '.swiper-button-next',
//         prevEl: '.swiper-button-prev',
//     },
//
//     // Scrollbar
//     scrollbar: {
//         el: '.swiper-scrollbar',
//     },
//
//     // Enable swiping with touch
//     touchEventsTarget: 'container',
//     edgeSwipeDetection: true,
//     edgeSwipeThreshold: 20,
//
//     // Остальные параметры...
// });
var swiper = new Swiper('.mySwiper',  {
    speed: 1000,
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 10000, // 10 секунд до автоматической смены слайда
        disableOnInteraction: false, // Продолжать автоматическое воспроизведение после ручного управления
    },
    navigation: {
        nextEl: '.swiper-button-next', // Следующий слайд
        prevEl: '.swiper-button-prev', // Предыдущий слайд
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

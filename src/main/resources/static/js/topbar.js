var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("topBar").style.top = "0";
    } else {
        document.getElementById("topBar").style.top = "-50px"; // Выберите значение для скрытия
    }
    prevScrollpos = currentScrollPos;
}

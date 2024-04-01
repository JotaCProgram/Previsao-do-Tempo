
//MOUSE MOVE:


let isDown = false;
let startX;
let scrollLeft;

const forecastContainer = document.getElementById('forecastContainer');

forecastContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    forecastContainer.classList.add('active');
    startX = e.pageX - forecastContainer.offsetLeft;
    scrollLeft = forecastContainer.scrollLeft;
});

forecastContainer.addEventListener('mouseleave', () => {
    isDown = false;
    forecastContainer.classList.remove('active');
});

forecastContainer.addEventListener('mouseup', () => {
    isDown = false;
    forecastContainer.classList.remove('active');
});

forecastContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - forecastContainer.offsetLeft;
    const walk = (x - startX) * 3; // O fator 3 aumenta a sensibilidade do arrasto
    forecastContainer.scrollLeft = scrollLeft - walk;
});


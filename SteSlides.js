//SETA:

document.getElementById('slideRight').addEventListener('click', function() {
    document.getElementById('forecastContainer').scrollBy({ left: 250, behavior: 'smooth' });
});

document.getElementById('slideLeft').addEventListener('click', function() {
    document.getElementById('forecastContainer').scrollBy({ left: -250, behavior: 'smooth' });
});

function checkNavigationArrows() {
    const forecastContainer = document.getElementById('forecastContainer');
    const slideLeftButton = document.getElementById('slideLeft');
    const slideRightButton = document.getElementById('slideRight');

    // Inicialmente, mostra ambos os botões
    slideLeftButton.style.display = 'block';
    slideRightButton.style.display = 'block';

    // Esconde a seta esquerda se estiver no início do scroll
    if (forecastContainer.scrollLeft === 0) {
        slideLeftButton.style.display = 'none';
    }

    // Esconde a seta direita se todo o conteúdo estiver visível
    if (forecastContainer.offsetWidth + forecastContainer.scrollLeft >= forecastContainer.scrollWidth) {
        slideRightButton.style.display = 'none';
    }
}

// Chama a função após a atualização das previsões e em eventos de scroll no container
document.getElementById('forecastContainer').addEventListener('scroll', checkNavigationArrows);

// Certifique-se de chamar checkNavigationArrows após preencher o forecastContainer com as previsões


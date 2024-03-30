// Botão para pegar a localização do usuário
document.getElementById('location-btn').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocalização não é suportada por este navegador.");
    }
});

// Função para mostrar a posição e buscar o clima
function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Chama getWeather com as coordenadas obtidas
    getWeather(lat, lon);
}

// Função para tratar possíveis erros na obtenção da localização
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Usuário negou a solicitação de Geolocalização.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Informações de localização indisponíveis.");
            break;
        case error.TIMEOUT:
            alert("A solicitação para obter a localização do usuário expirou.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Ocorreu um erro desconhecido.");
            break;
    }
}

// Função adaptada para usar latitude e longitude
function getWeather(lat, lon) {
    var apiKey = '8066df2176ca42f059b61b364c4e61f8'; // Use sua própria chave API
    var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        // Atualizações gerais baseadas na resposta
        document.getElementById('cityName').textContent = data.name;

        // Atualizando a velocidade do vento
        document.getElementById('windSpeed').textContent = `${data.wind.speed} km/h`;

        // Atualizando a umidade
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;

        // Atualizando a sensação térmica
        const feelsLike = data.main.feels_like;
        document.getElementById('feelsLike').textContent = `${feelsLike}°C`;

        // Determinando o ícone de sensação térmica
        const feelsLikeIcon = document.getElementById('feelsLikeIcon');
        if (feelsLike > 36) {
            feelsLikeIcon.src = 'term-hot.svg';
            feelsLikeIcon.alt = 'Calor';
        } else if (feelsLike > 28 && feelsLike <= 36) {
            feelsLikeIcon.src = 'term-warm.svg';
            feelsLikeIcon.alt = 'Temperatura amena';
        } else if (feelsLike < 16) {
            feelsLikeIcon.src = 'term-cold.svg';
            feelsLikeIcon.alt = 'Frio';
        }

        const weatherCondition = data.weather[0].main;
        const weatherDescription = data.weather[0].description;

        // Selecionando a imagem apropriada para a condição climática geral
        let weatherImageSrc;
        switch (weatherCondition) {
            case 'Clear':
                weatherImageSrc = 'ceu-limpo.svg';
                break;
            case 'Clouds':
                weatherImageSrc = 'few-clouds.svg';
                break;
            case 'MIst':
                    weatherImageSrc = 'mist.svg';
                    break;
            // Adicione mais casos conforme necessário
            default:
                weatherImageSrc = 'default-weather.svg'; // Uma imagem padrão para condições não especificadas
        }

        // Atualizando o DOM com a imagem e descrição da condição climática
        document.getElementById('weatherImage').src = weatherImageSrc;
        document.getElementById('weatherImage').alt = weatherDescription;
        document.getElementById('currentWeather').textContent = weatherDescription;
        document.getElementById('tempRange').textContent = `Máx: ${tempMax}°C, Mín: ${tempMin}°C`;
    })
    .catch(error => {
        console.error('Erro na solicitação:', error);
        // Tratamento de erro apropriado
    });
}






async function getTime(cityName) {
    try {
        // Carrega o mapeamento de fusos horários a partir de timezone.json
        const response = await fetch('timezone.json');
        if (!response.ok) {
            throw new Error(`Falha ao carregar timezone.json: ${response.statusText}`);
        }
        const timezoneData = await response.json();

        // Encontra a entrada do fuso horário para a cidade
        const timezoneInfo = Object.values(timezoneData).find(tz => tz.utc.includes(cityName));

        if (timezoneInfo) {
            console.log(`Fuso horário para ${cityName}:`, timezoneInfo);
            document.getElementById('timeResult').innerHTML = `Fuso horário em ${cityName}: ${timezoneInfo.text}`;
        } else {
            console.error(`Fuso horário não encontrado para ${cityName}`);
            document.getElementById('timeResult').innerHTML = `Fuso horário não encontrado para ${cityName}.`;
        }
    } catch (error) {
        console.error('Erro ao buscar o fuso horário:', error);
        document.getElementById('timeResult').innerHTML = 'Erro ao carregar fusos horários.';
    }
}

function getLocalTimeForOffset(offset) {
    // Obter a data e hora atuais em UTC
    const now = new Date();

    // Calcular o offset em milissegundos (note que o getTimezoneOffset retorna o inverso)
    const localOffset = now.getTimezoneOffset() * 60000;

    // Calcular a hora UTC em milissegundos
    const utc = now.getTime() + localOffset;

    // Aplicar o offset do fuso horário desejado e criar uma nova data
    const localTime = new Date(utc + (3600000*offset));

    // Formatar a data/hora local como uma string para exibição
    return localTime.toLocaleString();
}

// Exemplo de uso: para um fuso horário com offset -3 (como Brasília, fora do horário de verão)
const offsetBrasilia = -3;
console.log("Hora local para o offset:", getLocalTimeForOffset(offsetBrasilia));


document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('mainContainer');
    const hour = new Date().getHours(); // Obtém a hora atual

    // Considera-se "dia" entre as 6h e as 18h
    if (hour >= 6 && hour < 18) {
        container.classList.add('day');
        container.classList.remove('night');
    } else {
        container.classList.add('night');
        container.classList.remove('day');
    }
});

// Chama a função para definir o tema inicialmente
updateThemeBasedOnTime();

// Opção: você pode querer atualizar o tema automaticamente
// Isso pode ser feito configurando um intervalo ou ouvinte de eventos adequado
// Atualiza o tema a cada hora
setInterval(updateThemeBasedOnTime, 3600000); // 3600000 milissegundos = 1 hora



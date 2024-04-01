document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('mainContainer');
    const hour = new Date().getHours(); // Obtém a hora atual

    // Considera-se "day" entre as 6h e as 18h
    if (hour >= 6 && hour < 18) {
        container.classList.add('day');
        container.classList.remove('night');
    } else {
        container.classList.add('night');
        container.classList.remove('day');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Chama getForecast com as coordenadas obtidas
            getForecast(lat, lon);
            // Chama getWeather com as coordenadas obtidas para atualizar as informações climáticas atuais
            getWeather(lat, lon);

            // Traduza o conteúdo da página aqui ou chame a função de tradução
            translateContent();


        }, showError);
    } else {
        alert("Geolocalização não é suportada por este navegador.");
    }
});






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
            case 'Mist':
                    weatherImageSrc = 'mist.svg';
                    break;
            case 'Thunderstorm':
                weatherImageSrc = 'trovoada.svg';
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

function getForecast(lat, lon) {
    var apiKey = '8066df2176ca42f059b61b364c4e61f8'; // Use sua própria chave API
    // Adiciona 'https://' ao início da URL
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na rede - a resposta não foi ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Logando os dados recebidos da API no console
        updateForecastContainer(data); // Chama a função para atualizar o DOM com os dados da previsão
    })
    .catch(error => {
        console.error('Erro na solicitação:', error);
    });
}

const weatherIcons = {
    "01d": ["assets/clear-sky-day.svg", "assets/clear-sky-2-day.svg"],
    "01n": ["assets/clear-sky-night.svg", "assets/clear-sky-2-night.svg"],
    "02d": ["assets/few-clouds-day.svg"],
    "02n": ["assets/few-clouds-night.svg"],
    "03d": ["assets/scattered-clouds-day.svg"],
    "03n": ["assets/scattered-clouds-night.svg"],
    "04d": ["assets/broken-clouds-day.svg"],
    "04n": ["assets/broken-clouds-night.svg"],
    "09d": ["assets/shower-rain-day.svg"],
    "09n": ["assets/shower-rain-night.svg"],
    "10d": ["assets/rain-1-day.svg", "assets/rain-2-day.svg"],
    "10n": ["assets/rain-1-night.svg", "assets/rain-2-night.svg"],
    "11d": ["assets/thunderstorm-day.svg"],
    "11n": ["assets/thunderstorm-night.svg"],
    "13d": ["assets/snow-day.svg"],
    "13n": ["assets/snow-night.svg"],
    "50d": ["assets/mist-day.svg"],
    "50n": ["assets/mist-night.svg"]
};




function updateForecastContainer(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = ''; // Limpa o conteúdo anterior

    data.list.forEach((forecast, index) => {
        if (index < 7) { // Limita a 7 previsões
            const dateTime = new Date(forecast.dt * 1000);
            const tempMax = forecast.main.temp_max.toFixed(1); // Temperatura máxima
            const tempMin = forecast.main.temp_min.toFixed(1); // Temperatura mínima
            const description = forecast.weather[0].description;
            const speed = forecast.wind.speed;
            const humidity = forecast.main.humidity;

            const iconCode = forecast.weather[0].icon;
            let iconFileName;
            const variations = weatherIcons[iconCode];
            
            if (variations) {
                const randomIndex = Math.floor(Math.random() * variations.length);
                iconFileName = variations[randomIndex];
            }
    
            const iconUrl = iconFileName ? iconFileName : "http://openweathermap.org/img/w/" + iconCode + ".svg";
            console.log(iconUrl);
    
    
            const forecastDiv = document.createElement('div');
            forecastDiv.className = 'forecast-item';
            forecastDiv.innerHTML = `
            <h3>${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h3>
            <img src="${iconUrl}" alt="${description}" class="weather-icon" />
            <p class="weather-description">${description}</p>
            <p class="temperature-range"><span class="temp-max">${tempMax}°C</span> | <span class="temp-min">${tempMin}°C</span></p>
            <div class="wind-humidity-info">
                <img src="wind-icon.png" alt="Wind" class="small-icon">
                <span>${speed}km/h</span>
                <img src="humidity-icon.png" alt="Humidity" class="small-icon">
                <span>${humidity}%</span>
            </div>
        `;
        
            forecastContainer.appendChild(forecastDiv);
        }
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





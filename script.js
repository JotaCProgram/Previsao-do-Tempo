
async function getWeatherAndTime() {
    var cityName = document.getElementById('cityName').value; // Garantir que este ID esteja presente em seu input
    // Supondo que `getWeather` possa ser uma operação assíncrona
    try {
        await getWeather(cityName); // Adapte conforme a definição de sua função getWeather
        await getTime(cityName); // Certifique-se de que getTime também lida corretamente com assincronicidade
    } catch (error) {
        console.error('Erro ao obter clima e hora:', error);
    }
}

function getWeather() {
    var cityName = document.getElementById('cityName').value;
    var apiKey = '8066df2176ca42f059b61b364c4e61f8';
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        var weatherCondition = data.weather[0].main;
        var imageSrc = '';

        // Ajuste os URLs das imagens conforme necessário
        if (weatherCondition === 'Clouds') {
            imageSrc = '/clouds.svg'; // URL da sua imagem para "Nublado"
        } else if (weatherCondition === 'Rain') {
            imageSrc = '/rain.svg'; // URL da sua imagem para "Chuva"
        } else if (weatherCondition === 'clear') {
            imageSrc = '/rain.svg'; // URL da sua imagem para "Chuva"
        // Adicione mais condições conforme necessário
        }
        document.getElementById('weatherResult').innerHTML = 
            `<h2>Tempo em ${data.name}</h2>
             <p>Temperatura: ${data.main.temp} °C</p>
             <p>Condição: ${weatherCondition}</p>
             <img src="${imageSrc}" alt="Weather image">`;
    })
    .catch(error => {
        console.error('Erro na solicitação:', error);
        document.getElementById('weatherResult').innerHTML = `<p>Erro ao buscar os dados.</p>`;
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


function updateThemeBasedOnTime() {
    const now = new Date();
    const hour = now.getHours();

    // Define como dia das 6h às 18h
    const isDayTime = hour > 6 && hour < 18;

    const bodyClassList = document.body.classList;
    if (isDayTime) {
        bodyClassList.add('body-day');
        bodyClassList.remove('body-night');
    } else {
        bodyClassList.add('body-night');
        bodyClassList.remove('body-day');
    }
}

// Chama a função para definir o tema inicialmente
updateThemeBasedOnTime();

// Opção: você pode querer atualizar o tema automaticamente
// Isso pode ser feito configurando um intervalo ou ouvinte de eventos adequado
// Atualiza o tema a cada hora
setInterval(updateThemeBasedOnTime, 3600000); // 3600000 milissegundos = 1 hora

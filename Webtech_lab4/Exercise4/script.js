document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const weatherContainer = document.getElementById('weatherContainer');
    const cityNameEl = document.getElementById('cityName');
    const weatherMainEl = document.getElementById('weatherMain');
    const temperatureEl = document.getElementById('temperature');
    const humidityEl = document.getElementById('humidity');
    const conditionEl = document.getElementById('condition');
    const lastCityEl = document.getElementById('lastCity');

    let cachedWeather = null;
    let lastSearchedCity = '';

    // Mock geolocation data for popular cities
    const cityCoords = {
        'london': { lat: 51.5074, lon: -0.1278 },
        'new york': { lat: 40.7128, lon: -74.0060 },
        'mumbai': { lat: 19.0760, lon: 72.8777 },
        'delhi': { lat: 28.6139, lon: 77.2090 },
        'tokyo': { lat: 35.6895, lon: 139.6917 },
        'paris': { lat: 48.8566, lon: 2.3522 },
        'sydney': { lat: -33.8688, lon: 151.2093 },
        'mangalagiri': { lat: 16.4312, lon: 80.5687 },
        'mangalagiri': { lat: 16.4312, lon: 80.5687 },
        'vijayawada': { lat: 16.5062, lon: 80.6480 },
        'guntur': { lat: 16.3067, lon: 80.4365 },
        'amaravati': { lat: 16.5062, lon: 80.6480 }
         
    };

    // Get weather data
    async function fetchWeather(city) {
        showLoading();
        hideError();
        hideWeather();

        try {
            // Check cache first
            if (cachedWeather && cachedWeather.city === city.toLowerCase()) {
                displayWeather(cachedWeather.data, city);
                return;
            }

            // Try to get coordinates
            let coords = cityCoords[city.toLowerCase()];
            
            if (!coords) {
                throw new Error('City not supported. Try: London, Mumbai, Delhi, New York, etc.');
            }

            // Real API call (Open-Meteo - free, no key)
            const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Network error`);
            }

            const data = await response.json();
            const weatherData = {
                temperature: Math.round(data.current.temperature_2m),
                humidity: data.current.relative_humidity_2m,
                condition: parseWeatherCode(data.current.weather_code)
            };

            // Cache result
            cachedWeather = { city: city.toLowerCase(), data: weatherData };
            lastSearchedCity = city;

            displayWeather(weatherData, city);

        } catch (error) {
            console.error('Weather error:', error);
            showError(error.message || 'Failed to fetch weather data');
            
            // Fallback to mock data
            setTimeout(() => {
                showMockWeather(city);
            }, 1000);
        } finally {
            hideLoading();
        }
    }

    // Display weather
    function displayWeather(data, city) {
        cityNameEl.textContent = city.charAt(0).toUpperCase() + city.slice(1);
        temperatureEl.textContent = `${data.temperature}°C`;
        humidityEl.textContent = `${data.humidity}%`;
        conditionEl.textContent = data.condition;
        lastCityEl.textContent = city;
        
        weatherContainer.classList.add('show');
        cityInput.value = '';
    }

    // Show mock weather (when API fails)
    function showMockWeather(city) {
        const mockData = {
            temperature: 28 + Math.floor(Math.random() * 10),
            humidity: 60 + Math.floor(Math.random() * 20),
            condition: ['Sunny', 'Partly Cloudy', 'Clear'][Math.floor(Math.random() * 3)]
        };
        
        displayWeather(mockData, city);
        showMessage('Showing mock data (API temporarily unavailable)');
    }

    // Parse weather code to description
    function parseWeatherCode(code) {
        const codes = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers'
        };
        return codes[code] || 'Unknown';
    }

    // UI Functions
    function showLoading() {
        loadingSpinner.classList.remove('hidden');
        searchBtn.disabled = true;
        searchBtn.textContent = 'Searching...';
    }

    function hideLoading() {
        loadingSpinner.classList.add('hidden');
        searchBtn.disabled = false;
        searchBtn.textContent = 'Search Weather';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }

    function hideError() {
        errorMessage.classList.remove('show');
    }

    function hideWeather() {
        weatherContainer.classList.remove('show');
    }

    function showMessage(message) {
        const msg = document.createElement('div');
        msg.className = 'message success';
        msg.textContent = message;
        document.querySelector('.container').insertBefore(msg, document.querySelector('.search-box').nextSibling);
        setTimeout(() => msg.remove(), 3000);
    }

    // Event listeners
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        } else {
            showError('Please enter a city name');
        }
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // Load cached weather on page load
    if (cachedWeather && lastSearchedCity) {
        displayWeather(cachedWeather.data, lastSearchedCity);
    }
});

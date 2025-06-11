// API Configuration
const apikey="9cb97766a70edccc25964b593c12dbbe";
const apiurl="https://api.openweathermap.org/data/2.5/weather?&units=metric";

// DOM Element Selectors
const searchbox=document.querySelector(".search input");
const searchbtn=document.querySelector(".search button");
const weathericon=document.querySelector(".weather-icon");
const weatherType = document.querySelector(".weather-type");
const locationBtn = document.querySelector(".location-btn");
const tempUnitInputs = document.querySelectorAll('.temp-unit input[type="radio"]');
const themeSwitch = document.querySelector('.theme-switch input');

// Store the original Celsius temperature for unit conversion
let originalTemp = null;

// Utility Functions
// Convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Display Functions
// Show loading state while fetching weather data
function showLoading() {
    document.querySelector(".city").innerHTML = "Getting info...";
    document.querySelector(".temp").innerHTML = "--°C";
    document.querySelector(".humidity").innerHTML = "--%";
    document.querySelector(".wind").innerHTML = "-- km/h";
    document.querySelector(".pressure").innerHTML = "-- hPa";
    
    weathericon.src = "images/loading.gif";
    originalTemp = null;
}

// Update temperature display based on selected unit (C/F)
function updateTemperatureDisplay(temp, unit) {
    const tempElement = document.querySelector(".temp");
    if (unit === 'F') {
        const fahrenheit = Math.round(celsiusToFahrenheit(temp));
        tempElement.innerHTML = `${fahrenheit}°F`;
    } else {
        tempElement.innerHTML = `${Math.round(temp)}°C`;
    }
}

// Location Functions
// Get user's current location using browser's geolocation API
function getCurrentLocation() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoordinates(lat, lon);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to get your location. Please check your location permissions.");
                document.querySelector(".city").innerHTML = "Location Error";
                document.querySelector(".temp").innerHTML = "--°C";
                document.querySelector(".humidity").innerHTML = "--%";
                document.querySelector(".wind").innerHTML = "-- km/h";
                document.querySelector(".pressure").innerHTML = "-- hPa";
                weatherType.innerHTML = "Error";
                weathericon.src = "images/error.png";
                originalTemp = null;
            }
        );
    } else {
        alert("Geolocation is not supported by your browser");
    }
}

// Weather API Functions
// Fetch weather data using coordinates
async function getWeatherByCoordinates(lat, lon) {
    try {
        const fullUrl = `${apiurl}&lat=${lat}&lon=${lon}&appid=${apikey}`;
        console.log("Fetching from URL:", fullUrl);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(fullUrl);
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Received weather data:", data);

        // Store the original temperature
        originalTemp = data.main.temp;

        // Update UI with weather data
        document.querySelector(".city").innerHTML = data.name;
        updateTemperatureDisplay(originalTemp, getSelectedTempUnit());
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";
        
        // Update weather icon and background
        const weatherMain = data.weather[0].main.toLowerCase();
        console.log("Weather condition:", weatherMain);
        weatherType.innerHTML = data.weather[0].main;
        weathericon.src = `images/${weatherMain}.png`;
        document.querySelector("body").style.backgroundImage = `url(bgimg/${weatherMain}.jpg)`;
        document.querySelector("body").classList.add("bg-img");
        document.querySelector(".bg-img").position="fixed";
        
    } catch (error) {
        handleWeatherError(error);
    }
}

// Helper Functions
// Get currently selected temperature unit (C/F)
function getSelectedTempUnit() {
    const selectedUnit = document.querySelector('.temp-unit input[type="radio"]:checked');
    return selectedUnit.nextElementSibling.textContent === '°F' ? 'F' : 'C';
}

// Main weather check function for city search
async function checkweather(city){
    try {
        console.log("Searching for city:", city);
        
        if (!city) {
            throw new Error("Please enter a city name");
        }

        showLoading();
        
        const fullUrl = apiurl + `&q=${city}&appid=${apikey}`;
        console.log("Fetching from URL:", fullUrl);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(fullUrl);
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            handleApiError(response);
        }
        
        const data = await response.json();
        console.log("Received weather data:", data);

        originalTemp = data.main.temp;

        // Update UI with weather data
        document.querySelector(".city").innerHTML = data.name;
        updateTemperatureDisplay(originalTemp, getSelectedTempUnit());
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";
        
        const weatherMain = data.weather[0].main.toLowerCase();
        weatherType.innerHTML = data.weather[0].main;
        weathericon.src = `images/${weatherMain}.png`;
        document.querySelector("body").style.backgroundImage = `url(bgimg/${weatherMain}.jpg)`;
        document.querySelector("body").classList.add("bg-img");
        document.querySelector(".bg-img").position="fixed";
        
    } catch (error) {
        handleWeatherError(error);
    }
}

// Error Handling Functions
// Handle API-specific errors
function handleApiError(response) {
    if (response.status === 401) {
        throw new Error("Invalid API key. Please check your API key configuration.");
    } else if (response.status === 404) {
        throw new Error("City not found. Please check the spelling and try again.");
    } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
}

// Handle general weather data errors
function handleWeatherError(error) {
    console.error("Error fetching weather data:", error.message);
    
    if (error.name === 'AbortError') {
        alert("Request timed out. Please check your internet connection and try again.");
    } else if (error.message.includes("Failed to fetch")) {
        alert("Network error. Please check your internet connection and try again.");
    } else {
        alert(error.message);
    }
    
    // Reset display on error
    document.querySelector(".city").innerHTML = "Error";
    document.querySelector(".temp").innerHTML = "--°C";
    document.querySelector(".humidity").innerHTML = "--%";
    document.querySelector(".wind").innerHTML = "-- km/h";
    document.querySelector(".pressure").innerHTML = "-- hPa";
    weatherType.innerHTML = "Error";
    weathericon.src = "images/error.png";
    originalTemp = null;
}

// Event Listeners
// Temperature unit change handler
tempUnitInputs.forEach(input => {
    input.addEventListener('change', () => {
        if (originalTemp !== null) {
            updateTemperatureDisplay(originalTemp, getSelectedTempUnit());
        }
    });
});

// Search button click handler
searchbtn.addEventListener("click", () => {
    console.log("Search button clicked");
    const city = searchbox.value.toLowerCase();
    checkweather(city);
});

// Enter key handler for search
searchbox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        console.log("Enter key pressed");
        const city = searchbox.value.toLowerCase();
        checkweather(city);
    }
});

// Location button click handler
locationBtn.addEventListener("click", () => {
    console.log("Location button clicked");
    getCurrentLocation();
});

// Theme switching functionality
function toggleTheme() {
    const body = document.body;
    const nav = document.querySelector('nav');
    const isChecked = themeSwitch.checked;

    if (isChecked) {
        // Dark theme implementation
        body.classList.add('dark');
        nav.classList.add('dark');
    } else {
        // Light theme implementation
        body.classList.remove('dark');
        nav.classList.remove('dark');
    }
}

// Check for saved theme preference
if (localStorage.getItem('darkTheme') === 'enabled') {
    themeSwitch.checked = true;
    toggleTheme();
}

// Add event listener for theme switch
themeSwitch.addEventListener('change', toggleTheme);

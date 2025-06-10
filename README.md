# Weather App

A modern weather application that provides real-time weather information with a beautiful user interface.

## Features

- Real-time weather data using OpenWeatherMap API
- Temperature unit conversion (Celsius/Fahrenheit)
- Current location weather
- Dark/Light theme toggle
- Responsive design
- Dynamic background based on weather conditions
- Detailed weather information including:
  - Temperature
  - Humidity
  - Wind Speed
  - Pressure
  - Weather condition

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- OpenWeatherMap API

## Setup

1. Clone the repository:
```bash
git clone https://github.com/dushyanth96/weather-app.git
```

2. Get your API key from [OpenWeatherMap](https://openweathermap.org/api)

3. Replace the API key in `index.js`:
```javascript
const apikey = "YOUR_API_KEY";
```

4. Open `index.html` in your browser

## Usage

- Enter a city name in the search box
- Click the search button or press Enter
- Use the location button to get weather for your current location
- Toggle between Celsius and Fahrenheit using the temperature unit selector
- Switch between light and dark themes using the theme toggle

## Project Structure

```
weather-app/
├── index.html
├── style.css
├── index.js
├── images/
│   ├── clear.png
│   ├── clouds.png
│   ├── drizzle.png
│   ├── humidity.png
│   ├── mist.png
│   ├── rain.png
│   ├── snow.png
│   └── wind.png
└── bgimg/
    ├── clear.jpg
    ├── clouds.jpg
    ├── drizzle.jpg
    ├── mist.jpg
    ├── rain.jpg
    └── snow.jpg
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons and images used in the project 
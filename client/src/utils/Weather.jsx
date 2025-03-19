import { useEffect, useState } from 'react';
import './weather.css'; // Ensure the CSS file is imported
import humidity from '../assets/images/humidity.png';
import temperature from '../assets/images/temerature.png';
import wind from '../assets/images/feelsLike.png';
import weather from '../assets/images/cloud.png';

const Weather = ({ setShowWeather }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = '275a63a970bc3a6bc9816876fd40b9f7';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=New%20York&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`Weather data fetch failed: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Weather data:', data);
        setWeatherData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className='weather-window'>
      <div className='close-weather-window' onClick={() => setShowWeather(false)}>✕</div>
      {loading ? (
        <p>Loading weather data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : weatherData && weatherData.main ? (
        <div className="weather-content">
          <h2 className='weather-title'>New York Weather</h2>
          <div className="weather-info">
            <p><img src={temperature} alt="temperature" className='weather-inner-icon'/> Temperature: {Math.round(weatherData.main.temp)}°C </p>
            <p><img src={wind} alt="wind" className='weather-inner-icon'/> Feels like: {Math.round(weatherData.main.feels_like)}°C </p>
            <p><img src={humidity} alt="humidity" className='weather-inner-icon'/> Humidity: {weatherData.main.humidity}% </p>
            <p><img src={weather} alt="weather" className='weather-inner-icon'/> Weather: {weatherData.weather[0].description} </p>
          </div>
        </div>
      ) : (
        <p>No weather data available</p>
      )}
    </div>
  );
};

export default Weather;

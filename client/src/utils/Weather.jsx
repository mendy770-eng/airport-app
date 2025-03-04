import { useState, useEffect } from 'react';
import './weather.css'; // Ensure the CSS file is imported

const Weather = ({ isOpen, onClose }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchWeatherData();
    }
  }, [isOpen]);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Tel%20Aviv&appid=4e85ee186057407a8cf91202252702&units=metric`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Weather Information</h2>
        {error && <p>Error: {error}</p>}
        {weatherData ? (
          <div>
            <p>Location: {weatherData.name}</p>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Condition: {weatherData.weather[0].description}</p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    </div>
  );
};

export default Weather;

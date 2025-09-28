import { useState, useEffect } from 'react';
import './css/airportinspector.css';
import WarningModal from './WarningModal';

const AirportInspector = () => {
    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'arrivals', 'departures'
    const [runwayStatus, setRunwayStatus] = useState(() => {
        return localStorage.getItem('runwayStatus') || 'free';
    });
    const [showWarning, setShowWarning] = useState(false);
    const [disabledFlights, setDisabledFlights] = useState([]);
    const [weatherData, setWeatherData] = useState(null);

    const handleApprove = (flightNumber) => {
        if (runwayStatus === 'busy') {
            setShowWarning(true);
            return;
        }
        
        console.log(`Flight ${flightNumber} approved`);
        setRunwayStatus('busy');
        localStorage.setItem('runwayStatus', 'busy');
        
        setTimeout(() => {
            setRunwayStatus('free');
            localStorage.setItem('runwayStatus', 'free');
        }, 10000);
    };

    const handleHold = (flightNumber) => {
        console.log(`Flight ${flightNumber} held`);
        setDisabledFlights(prev => [...prev, flightNumber]);
    };

    const handleRelease = (flightNumber) => {
        console.log(`Flight ${flightNumber} released`);
        setDisabledFlights(prev => prev.filter(num => num !== flightNumber));
    };

    const sortByDeparture = (list) => {
        return [...list].sort((a, b) => new Date(a.departure) - new Date(b.departure));
    };

    const filterArrivals = () => {
        setActiveFilter('arrivals');
        setFilteredFlights(sortByDeparture(flights.filter(flight => flight.destination === 'JFK')));
    };

    const filterDepartures = () => {
        setActiveFilter('departures');
        setFilteredFlights(sortByDeparture(flights.filter(flight => flight.source === 'JFK')));
    };

    const showAllFlights = () => {
        setActiveFilter('all');
        setFilteredFlights(flights);
    };

    const formatDateTime = (date) => {
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/flights');  // שימוש ב-endpoint של המונגו
                if (!response.ok) throw new Error('Failed to fetch flights');
                const data = await response.json();
                const sorted = [...data].sort((a, b) => new Date(a.departure) - new Date(b.departure));
                setFlights(sorted);
                setFilteredFlights(sorted);
            } catch (error) {
                console.error('Error fetching flights:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const API_KEY = '275a63a970bc3a6bc9816876fd40b9f7';
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=New%20York&units=metric&appid=${API_KEY}`);
                if (!response.ok) return;
                const data = await response.json();
                setWeatherData(data);
            } catch {
                // ignore weather errors in inspector
            }
        };
        fetchWeather();
    }, []);

    if (loading) return <div>loading flights information...</div>;
    if (error) return <div>{error}</div>;
    if (!filteredFlights.length) return <div>currently no flights available</div>;

    return <div>
        <h2 className="inspector-title">flights information</h2>
        <div className='inspector-container'>
            <div className="flights-list-inspector">
                {filteredFlights.map((flight, index) => {
                    const departureTime = new Date(flight.departure);
                    const arrivalTime = new Date(flight.arrival);

                    return (
                        <div key={index} className="flight-item">
                            <div className="flight-info">
                                <div>Flight Number: {flight.flightNumber}</div>
                                <div>From: {flight.source}</div>
                                <div>To: {flight.destination}</div>
                                <div>Departure: {formatDateTime(departureTime)}</div>
                                <div>Arrival: {formatDateTime(arrivalTime)}</div>
                            </div>
                            <div className="flight-actions">
                                {disabledFlights.includes(flight.flightNumber) ? (
                                    <div className="hold-container">
                                        <div className="hold-status">
                                            <div>THE FLIGHT</div>
                                            <div>IS ON</div>
                                            <div>HOLD</div>
                                        </div>
                                        <button
                                            className="release-btn"
                                            onClick={() => handleRelease(flight.flightNumber)}
                                        >
                                            <div>RELEASE</div>
                                            <div>THE</div>
                                            <div>FLIGHT</div>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            className="approve-btn"
                                            onClick={() => handleApprove(flight.flightNumber)}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="hold-btn"
                                            onClick={() => handleHold(flight.flightNumber)}
                                        >
                                            Hold
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="rightSideFunctions">
                <div className="runway-status">
                    <div className="runway-status-item">
                        RUNWAY STATUS
                    </div>
                    <div className={`runway-status-item ${runwayStatus === 'free' ? 'status-free' : 'status-busy'}`}>
                        {runwayStatus.toUpperCase()}
                    </div>
                </div>
                <button
                    className={`filter-btn ${activeFilter === 'arrivals' ? 'active' : ''}`}
                    onClick={filterArrivals}
                >
                    Show JFK Arrivals
                </button>
                <button
                    className={`filter-btn ${activeFilter === 'departures' ? 'active' : ''}`}
                    onClick={filterDepartures}
                >
                    Show JFK Departures
                </button>
                {activeFilter !== 'all' && (
                    <button
                        className="filter-btn"
                        onClick={showAllFlights}
                    >
                        Show All Flights
                    </button>
                )}
                <button className="emergency-button" onClick={() => {
                    try {
                        localStorage.setItem('emergencyStatus', 'declared');
                        window.dispatchEvent(new CustomEvent('emergency-status-change', { detail: { status: 'declared' } }));
                    } catch (e) {
                        console.error('Failed to declare emergency:', e);
                    }
                }}>
                    Emergency Situation
                </button>
                <div className={`weather-indicator ${weatherData && weatherData.main && typeof weatherData.main.temp === 'number' ? (weatherData.main.temp < 30 ? 'weather-cool' : 'weather-hot') : ''}`}>
                    <div>THE WEATHER RIGHT NOW:</div>
                    <div className="weather-temperature">{
                        weatherData && weatherData.main && weatherData.weather && weatherData.weather[0]
                            ? `${Math.round(weatherData.main.temp)}°C, ${weatherData.weather[0].description}`
                            : 'loading...'
                    }</div>
                </div>
            </div>

            {showWarning && (
                <WarningModal onClose={() => setShowWarning(false)} />
            )}
        </div>
    </div>
};

export default AirportInspector;

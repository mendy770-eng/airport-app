import { useState, useEffect } from 'react';
import './css/airportinspector.css';
import WarningModal from './WarningModal';
import { useEmergency } from '../utils/useEmergency';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
        date: date.toLocaleDateString('en-GB'), // dd/mm/yyyy format
        time: date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        }) // hh:mm format
    };
};

const AirportInspector = () => {
    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'arrivals', 'departures'
    const [runwayStatus, setRunwayStatus] = useState('free');
    const [showWarning, setShowWarning] = useState(false);
    const [disabledFlights, setDisabledFlights] = useState([]);
    const { declareEmergency } = useEmergency();

    const handleApprove = (flightNumber) => {
        if (runwayStatus === 'busy') {
            setShowWarning(true);
            return;
        }
        console.log(`Flight ${flightNumber} approved`);
        setRunwayStatus('busy');
        setTimeout(() => {
            setRunwayStatus('free');
        }, 10000);
    };

    const handleHold = (flightNumber) => {
        if (runwayStatus === 'busy') {
            setShowWarning(true);
            return;
        }
        console.log(`Flight ${flightNumber} held`);
        
        // הוספת הטיסה לרשימת הטיסות המושבתות
        setDisabledFlights(prev => [...prev, flightNumber]);
        
        // הסרת הטיסה מהרשימה אחרי 10 שניות
        setTimeout(() => {
            setDisabledFlights(prev => prev.filter(num => num !== flightNumber));
        }, 10000);
    };

    const filterArrivals = () => {
        setActiveFilter('arrivals');
        setFilteredFlights(flights.filter(flight => flight.arrival.airport === 'JFK'));
    };

    const filterDepartures = () => {
        setActiveFilter('departures');
        setFilteredFlights(flights.filter(flight => flight.departure.airport === 'JFK'));
    };

    const showAllFlights = () => {
        setActiveFilter('all');
        setFilteredFlights(flights);
    };

    const handleEmergency = () => {
        declareEmergency();
    };

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await fetch('/api/flights/live');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setFlights(data);
                setFilteredFlights(data); // Initialize filtered flights with all flights
                setLoading(false);
            } catch (err) {
                console.error('Error fetching flights:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);

    if (loading) return <div>loading flights information...</div>;
    if (error) return <div>{error}</div>;
    if (!filteredFlights.length) return <div>currently no flights available</div>;

    return (
        <div className="inspector-container">
            <h2>flights information</h2>
            <div className="inner-container">
                <div className="flights-container">
                    <div className="flights-list">
                        {filteredFlights.map((flight, index) => {
                            const departureTime = formatDate(flight.departure.time);
                            const arrivalTime = formatDate(flight.arrival.time);

                            return (
                                <div key={`${flight.flightNumber}-${index}`} className="flight-item">
                                    <div className="flight-info">
                                        <div>flight number: {flight.flightNumber}</div>
                                        <div>departure: {departureTime.date} {departureTime.time}</div>
                                        <div>landing: {arrivalTime.date} {arrivalTime.time}</div>
                                        <div>source: {flight.departure.airport}</div>
                                        <div>destination: {flight.arrival.airport}</div>
                                    </div>
                                    <div className="flight-actions">
                                        {disabledFlights.includes(flight.flightNumber) ? (
                                            <div className="hold-status">
                                                THE FLIGHT IS ON HOLD
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
                    <button className="emergency-button" onClick={handleEmergency}>
                        Emergency Situation
                    </button>
                </div>
            </div>
            {showWarning && (
                <WarningModal onClose={() => setShowWarning(false)} />
            )}
        </div>
    );
};

export default AirportInspector;

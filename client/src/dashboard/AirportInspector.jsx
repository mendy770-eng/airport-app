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

    const filterArrivals = () => {
        setActiveFilter('arrivals');
        setFilteredFlights(flights.filter(flight => flight.destination === 'JFK'));
    };

    const filterDepartures = () => {
        setActiveFilter('departures');
        setFilteredFlights(flights.filter(flight => flight.source === 'JFK'));
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
                setFlights(data);
                setFilteredFlights(data);
            } catch (error) {
                console.error('Error fetching flights:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
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
                <button className="emergency-button">
                    Emergency Situation
                </button>
            </div>

            {showWarning && (
                <WarningModal onClose={() => setShowWarning(false)} />
            )}
        </div>
    </div>
};

export default AirportInspector;

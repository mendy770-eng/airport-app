import { useState, useEffect } from 'react';
import './css/airportinspector.css';

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

  const handleApprove = (flightNumber) => {
    console.log(`Flight ${flightNumber} approved`);
    // כאן תוכל להוסיף לוגיקה נוספת
  };

  const handleHold = (flightNumber) => {
    console.log(`Flight ${flightNumber} held`);
    // כאן תוכל להוסיף לוגיקה נוספת
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="filters">
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
        </div>
      </div>
    </div>
  );
};

export default AirportInspector;

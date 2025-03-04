import { useState, useEffect } from 'react';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import garbageIcon from '../../assets/images/garbage.png';
import '../managerModals/css/flightsListModal.css';

const FlightsListModal = ({ showModal, setShowModal }) => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newFlight, setNewFlight] = useState({
        flightNumber: '',
        source: '',
        destination: '',
        departure: '',
        arrival: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    const fetchFlights = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/flights');
            if (!response.ok) throw new Error('Failed to fetch flights');
            const data = await response.json();
            setFlights(data);
        } catch (error) {
            console.error('Error fetching flights:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFlight(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateOrUpdateFlight = async () => {
        const existingFlight = flights.find(flight => flight.flightNumber === newFlight.flightNumber);
        const method = existingFlight ? 'PUT' : 'POST';
        try {
            const url = existingFlight ? `/api/flights/${existingFlight._id}` : '/api/flights';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newFlight)
            });

            if (!response.ok) throw new Error(`Failed to ${method === 'POST' ? 'create' : 'update'} flight`);
            const updatedFlight = await response.json();

            if (method === 'POST') {
                setFlights(prevFlights => [...prevFlights, updatedFlight]);
            } else {
                setFlights(prevFlights => prevFlights.map(flight => flight._id === updatedFlight._id ? updatedFlight : flight));
            }

            setShowAddModal(false);
        } catch (error) {
            console.error(`Error ${method === 'POST' ? 'creating' : 'updating'} flight:`, error);
            setError(error.message);
        }
    };

    const handleEditFlight = (flight) => {
        setIsEditing(true);
        setNewFlight({
            flightNumber: flight.flightNumber,
            source: flight.source,
            destination: flight.destination,
            departure: flight.departure,
            arrival: flight.arrival
        });
        setShowAddModal(true);
    };

    const handleAddNewFlight = () => {
        setIsEditing(false);
        setNewFlight({
            flightNumber: '',
            source: '',
            destination: '',
            departure: '',
            arrival: ''
        });
        setShowAddModal(true);
    };

    const handleDeleteFlight = async (id) => {
        try {
            const response = await fetch(`/api/flights/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete flight');
            setFlights(prevFlights => prevFlights.filter(flight => flight._id !== id));
        } catch (error) {
            console.error('Error deleting flight:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        if (showModal) {
            fetchFlights();
        }
    }, [showModal]);

    const flightList = flights || [];

    return (
        showModal && (
            <div className="modal-overlay">
                <div className="modal-content flights-modal">
                    {!showAddModal ? (
                        <>
                            <div className="modal-header">
                                <div className="action-icon-tooltip">
                                    <button className="add-button-flights-list" onClick={handleAddNewFlight}>+</button>
                                    <span className="tooltiptext">Add New Flight</span>
                                </div>
                                <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
                            </div>
                            <h2 className="modal-title">Flights List</h2>
                            <div className="flights-list">
                                {loading ? (
                                    <div>Loading flights...</div>
                                ) : error ? (
                                    <div>Error: {error}</div>
                                ) : (
                                    flightList.length > 0 ? (
                                        flightList.map((flight, index) => (
                                            <div key={index} className="flight-item">
                                                <div className="flight-columns">
                                                    <div className="flight-column">
                                                        <div className="flight-detail">
                                                            <span className="label">Flight Number:</span>
                                                            <span>{flight.flightNumber}</span>
                                                        </div>
                                                        <div className="flight-detail">
                                                            <span className="label">Source:</span>
                                                            <span>{flight.source}</span>
                                                        </div>
                                                        <div className="flight-detail">
                                                            <span className="label">Destination:</span>
                                                            <span>{flight.destination}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flight-column">
                                                        <div className="flight-detail">
                                                            <span className="label">Departure:</span>
                                                            <span>
                                                                {(() => {
                                                                    const date = new Date(flight.departure);
                                                                    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                                                                })()}
                                                            </span>
                                                        </div>
                                                        <div className="flight-detail">
                                                            <span className="label">Landing:</span>
                                                            <span>
                                                                {(() => {
                                                                    const date = new Date(flight.arrival);
                                                                    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                                                                })()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flight-actions">
                                                    <div className="action-icon-tooltip">
                                                        <ModeEditOutlineIcon 
                                                            className="edit-icon"
                                                            onClick={() => handleEditFlight(flight)}
                                                        />
                                                        <span className="tooltiptext">Edit Flight</span>
                                                    </div>
                                                    <div className="action-icon-tooltip">
                                                        <img
                                                            src={garbageIcon}
                                                            alt="delete"
                                                            className="delete-icon"
                                                            onClick={() => handleDeleteFlight(flight._id)}
                                                        />
                                                        <span className="tooltiptext">Delete Flight</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>No flights available</div>
                                    )
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <button 
                                className="close-button" 
                                onClick={() => setShowAddModal(false)}
                            >✕</button>
                            <h2 className='add-flight-title'>Details for the new flight</h2>
                            <div className="new-flight-form">
                                <div className="form-group">
                                    <label>Flight Number:</label>
                                    <input
                                        type="text"
                                        name="flightNumber"
                                        value={newFlight.flightNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Source:</label>
                                    <input
                                        type="text"
                                        name="source"
                                        value={newFlight.source}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Destination:</label>
                                    <input
                                        type="text"
                                        name="destination"
                                        value={newFlight.destination}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Departure:</label>
                                    <input
                                        type="datetime-local"
                                        name="departure"
                                        value={newFlight.departure}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Landing:</label>
                                    <input
                                        type="datetime-local"
                                        name="arrival"
                                        value={newFlight.arrival}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <button 
                                    className="create-flight-button"
                                    onClick={handleCreateOrUpdateFlight}
                                >
                                    {isEditing ? 'Update Flight' : 'Create Flight'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    );
};

export default FlightsListModal;

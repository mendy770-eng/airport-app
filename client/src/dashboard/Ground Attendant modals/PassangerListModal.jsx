import { useEffect, useState } from 'react';
import './css/passangerListModal.css'
import GarbageIcon from '../../assets/images/garbage.png';
import EditIcon from '@mui/icons-material/Edit';
import NewPassangerModal from './NewPassangermodal';

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};

export default function PassangerListModal({ showModal, setShowModal }) {
    const [passengers, setPassengers] = useState([]);
    const [editingPassenger, setEditingPassenger] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState('');

    const fetchPassengers = async (flightNumber = '') => {
        try {
            const url = flightNumber 
                ? `/api/passengers?flight=${flightNumber}`
                : '/api/passengers';
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch passengers');
            const data = await response.json();
            console.log('Fetched passengers:', data);
            setPassengers(data);
        } catch (error) {
            console.error('Error fetching passengers:', error);
        }
    };

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await fetch('/api/flights');
                const data = await response.json();
                if (!response.ok) throw new Error('Failed to fetch flights');
                setFlights(data);
            } catch (error) {
                console.error('Error fetching flights:', error);
            }
        };

        if (showModal) {
            fetchFlights();
            fetchPassengers();
        }
    }, [showModal]);

    useEffect(() => {
        if (showModal) {
            fetchPassengers(selectedFlight);
        }
    }, [selectedFlight, showModal]);

    const handleDeletePassenger = async (passengerId) => {
        try {
            const response = await fetch(`/api/passengers/${passengerId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete passenger');
            }

            setPassengers(passengers.filter(p => p._id !== passengerId));
        } catch (error) {
            console.error('Error deleting passenger:', error);
            alert('Failed to delete passenger');
        }
    };

    const handleEdit = (passenger) => {
        setEditingPassenger(passenger);
        setShowEditModal(true);
    };

    if (!showModal) return null;

    return (
        <>
            <div className="modal-overlay-passengerList">
                <div className="modal-content-passangerModal">
                    <div className="modal-header">
                        <h2 className='passangers-list-title'>Passenger List</h2>
                        <select
                            value={selectedFlight}
                            onChange={(e) => setSelectedFlight(e.target.value)}
                            className='flight-select-passangerList'
                        >
                            <option value="">Select the flight number</option>
                            {flights.map((flight) => (
                                <option key={flight.flightNumber} value={flight.flightNumber}>
                                    Flight {flight.flightNumber} - {flight.source} to {flight.destination}
                                </option>
                            ))}
                        </select>
                        <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
                    </div>
                    
                    <div className="passangers-list">
                        {passengers.length > 0 ? (
                            passengers.map((passenger) => (
                                <div key={passenger._id} className="passanger-list-item">
                                    <div className="passenger-info">
                                        <div className="info-columns">
                                            <div className="column">
                                                <div>First Name: {passenger?.firstName}</div>
                                                <div>Date of Birth: {formatDate(passenger?.DateOfBirth)}</div>
                                            </div>
                                            <div className="column">
                                                <div>Last Name: {passenger?.lastName}</div>
                                                <div>Flight Number: {passenger?.flightNumber}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="passenger-actions">
                                        <div className="tooltip-container">
                                            <EditIcon
                                                className="action-icon"
                                                onClick={() => handleEdit(passenger)}
                                            />
                                            <span className="tooltip">Edit</span>
                                        </div>
                                        <div className="tooltip-container">
                                            <img
                                                src={GarbageIcon}
                                                alt="Delete"
                                                className="action-icon"
                                                onClick={() => handleDeletePassenger(passenger._id)}
                                            />
                                            <span className="tooltip">Delete</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results-message">
                                No passengers found for this flight
                            </div>
                        )}
                    </div>
                </div>
            </div>
            { showEditModal && (
                <NewPassangerModal
                    showModal={showEditModal}
                    setShowModal={setShowEditModal}
                    editMode={true}
                    passengerToEdit={editingPassenger}
                />
            )
}
        </>
    );
}
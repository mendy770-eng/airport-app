import { useEffect, useState } from 'react';
import './css/passangerListModal.css';
import GarbageIcon from '../../assets/images/garbage.png';
import EditIcon from '@mui/icons-material/Edit';

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};

const PassangerListModal = ({ showModal, setShowModal }) => {
    const [passengers, setPassengers] = useState([]);

    useEffect(() => {
        const fetchPassengers = async () => {
            try {
                const response = await fetch('/api/passengers');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch passengers');
                }

                console.log('Client: Received data:', data);
                const passengersList = data.passengers || data;
                setPassengers(passengersList);
            } catch (error) {
                console.error('Error fetching passengers:', error);
            }
        };

        if (showModal) {
            fetchPassengers();
        }
    }, [showModal]);

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

    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content-passangerModal">
                <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
                <h2 className='passangers-list-title'>Passenger List</h2>
                <div className="passangers-list">
                    {Array.isArray(passengers) && passengers.map((passenger) => (
                        <div key={passenger._id} className="passanger-list-item">
                            <div className="passenger-info">
                                <div className="info-columns">
                                    <div className="column">
                                        <div>First Name: {passenger?.firstname}</div>
                                        <div>Date of Birth: {formatDate(passenger?.dateOfBirth)}</div>
                                    </div>
                                    <div className="column">
                                        <div>Last Name: {passenger?.lastname}</div>
                                        <div>Flight Number: {passenger?.flightNumber}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="passenger-actions">
                                <div className="tooltip-container">
                                    <EditIcon className="action-icon" />
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PassangerListModal;
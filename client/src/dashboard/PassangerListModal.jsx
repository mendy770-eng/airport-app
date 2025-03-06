import { useEffect, useState } from 'react';
import './css/PassangerListModal.css';

const PassangerListModal = ({ showModal, setShowModal }) => {
    const [passengers, setPassengers] = useState([]);

    useEffect(() => {
        const fetchPassengers = async () => {
            try {
                const response = await fetch('/api/passengers');
                if (!response.ok) throw new Error('Failed to fetch passengers');
                const data = await response.json();
                setPassengers(data);
            } catch (error) {
                console.error('Error fetching passengers:', error);
            }
        };

        if (showModal) {
            fetchPassengers();
        }
    }, [showModal]);

    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
                <h2 className='passangers-list-title'>Passenger List</h2>
                <ul>
                    {passengers.map((passenger, index) => (
                        <li key={index}>{passenger.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PassangerListModal;
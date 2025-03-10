import { useEffect, useState } from 'react';
import './css/passangerListModal.css'
import GarbageIcon from '../../assets/images/garbage.png';
import EditIcon from '@mui/icons-material/Edit';
import NewPassangerModal from './NewPassangermodal';
import SearchIcon from '@mui/icons-material/Search';

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};

const PassangerListModal = ({ showModal, setShowModal }) => {
    const [passengers, setPassengers] = useState([]);
    const [editingPassenger, setEditingPassenger] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchFlight, setSearchFlight] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchError, setSearchError] = useState('');

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

    const handleSearchClick = () => {
        if (searchFlight) {
            const filteredPassengers = passengers.filter(passenger => 
                passenger.flightNumber.toLowerCase().includes(searchFlight.toLowerCase())
            );
            if (filteredPassengers.length === 0) {
                setSearchError('The flight doesn\'t exist in the database');
            } else {
                setSearchError('');
                setPassengers(filteredPassengers);
            }
        }
    };

    const handleShowAll = async () => {
        const response = await fetch('/api/passengers');
        const data = await response.json();
        setPassengers(data);
        setSearchFlight('');
        setSearchError('');
    };

    const handleEdit = (passenger) => {
        setEditingPassenger(passenger);
        setShowEditModal(true);
    };

    if (!showModal) return null;

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content-passangerModal">
                    <div className="modal-header">
                        <div className="search-container">
                            <div className="tooltip-container">
                                <SearchIcon 
                                    className="search-icon" 
                                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                                />
                                <span className="tooltip search-tooltip">Search by flight</span>
                            </div>
                            {isSearchVisible && (
                                <div className="search-input-container">
                                    <input
                                        type="text"
                                        placeholder="Enter flight number"
                                        value={searchFlight}
                                        onChange={(e) => setSearchFlight(e.target.value)}
                                    />
                                    <button onClick={handleSearchClick}>Search</button>
                                    <button onClick={handleShowAll} className="show-all-button">Show All</button>
                                    {searchError && <div className="search-error">{searchError}</div>}
                                </div>
                            )}
                        </div>
                        <h2 className='passangers-list-title'>Passenger List</h2>
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
                                The flight is not exist in the database
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showEditModal && (
                <NewPassangerModal 
                    showModal={showEditModal}
                    setShowModal={setShowEditModal}
                    editMode={true}
                    passengerToEdit={editingPassenger}
                />
            )}
        </>
    );
};

export default PassangerListModal;
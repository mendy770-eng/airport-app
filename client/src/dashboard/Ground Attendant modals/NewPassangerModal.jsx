import './css/newPassanger.css';
import { useState, useEffect } from 'react';

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};

const NewPassangerModal = ({ showModal, setShowModal, editMode = false, passengerToEdit = null }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        DateOfBirth: '',
        flightNumber: ''
    });

    // טעינת נתוני הנוסע לעריכה
    useEffect(() => {
        if (editMode && passengerToEdit) {
            setFormData({
                firstName: passengerToEdit.firstName || '',
                lastName: passengerToEdit.lastName || '',
                DateOfBirth: formatDate(passengerToEdit.DateOfBirth) || '',
                flightNumber: passengerToEdit.flightNumber || ''
            });
        }
    }, [editMode, passengerToEdit]);

    if (!showModal) return null;

    const handleSubmit = async () => {
        try {
            const url = editMode 
                ? `/api/passengers/${passengerToEdit._id}`
                : '/api/passengers';

            const method = editMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    boarded: editMode ? passengerToEdit.boarded : false
                }),
            });

            if (!response.ok) {
                throw new Error(editMode ? 'Failed to update passenger' : 'Failed to add passenger');
            }

            setFormData({
                firstName: '',
                lastName: '',
                DateOfBirth: '',
                flightNumber: ''
            });
            alert(editMode ? 'Passenger updated successfully!' : 'Passenger added successfully!');
            setShowModal(false);

        } catch (error) {
            console.error(editMode ? 'Error updating passenger:' : 'Error adding passenger:', error);
            alert(editMode ? 'Failed to update passenger' : 'Failed to add passenger');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
                <h2 className='modal-title-passangerList'>{editMode ? 'Edit Passenger' : 'Add New Passenger'}</h2>
                <div className="form-container">
                    <div className="input-group">
                        <label>First Name:</label>
                        <input 
                            type="text" 
                            value={formData.firstName || ''}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                    </div>
                    <div className="input-group">
                        <label>Last Name:</label>
                        <input 
                            type="text"
                            value={formData.lastName || ''}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                    </div>
                    <div className="input-group">
                        <label>Date of Birth:</label>
                        <input 
                            type="date"
                            value={formData.DateOfBirth || ''}
                            onChange={(e) => setFormData({...formData, DateOfBirth: e.target.value})}
                        />
                    </div>
                    <div className="input-group">
                        <label>Flight Number:</label>
                        <input 
                            type="text"
                            value={formData.flightNumber || ''}
                            onChange={(e) => setFormData({...formData, flightNumber: e.target.value})}
                        />
                    </div>
                    <button className="submit-button" onClick={handleSubmit}>
                        {editMode ? 'Update the Details' : 'Add the Passenger'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewPassangerModal;
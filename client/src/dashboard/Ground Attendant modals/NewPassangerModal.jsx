import './css/newPassanger.css';

const NewPassangerModal = ({ showModal, setShowModal }) => {
    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
                <h2 className='modal-title'>Add New Passenger</h2>
                <div className='details-input-list'>
                    hello world
                </div>
            </div>
        </div>
    );
};

export default NewPassangerModal;
import '../css/manager.css';


const StoreModal = ({ showModal, setShowModal }) => {
    return (
        showModal && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
                    <h2>Store Management</h2>
                    {/* תוכן המודאל */}
                </div>
            </div>
        )
    );
};

export default StoreModal;

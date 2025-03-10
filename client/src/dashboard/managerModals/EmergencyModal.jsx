import '../managerModals/css/emergencyModal.css'

const EmergencyModal = ({ showModal, setShowModal }) => {
    return (
        showModal && (
                <div className="modal-content-emergency-modal">
                    <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
                    <h2 className="emergency-modal-title">Emergency Status</h2>
                    <div className="emergency-status">Emergency status: <br/> all clear</div>
                </div>
        )
    );
};

export default EmergencyModal;
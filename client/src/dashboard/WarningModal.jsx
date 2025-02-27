const WarningModal = ({ onClose }) => {
    return (
        <div className="warning-modal-overlay">
            <div className="warning-modal">
                <button className="close-button" onClick={onClose}>✕</button>
                <div className="warning-content">
                    WARNING: THE RUNWAY IS BUSY
                </div>
            </div>
        </div>
    );
};

export default WarningModal; 
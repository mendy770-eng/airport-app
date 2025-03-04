import cameraVideo from '../../assets/videos/cameraView.mp4';
import '../managerModals/css/cameraModal.css';

const CameraModal = ({ showModal, setShowModal }) => {
    return (
        showModal && (
            <div className="modal-overlay">
                <div className="modal-content camera-modal">
                    <h2 className="camera-modal-title">Cameras accross the airport</h2>
                    <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
                    <div className="video-container">
                        <video
                            autoPlay
                            loop
                            muted
                            controls={false}
                            className="camera-video"
                        >
                            <source src={cameraVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        )
    );
};

export default CameraModal;

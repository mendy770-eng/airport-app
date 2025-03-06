import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import cameraIcon from '../assets/images/camera.png';
import emergencyIcon from '../assets/images/emergency.png'
import planeIcon from '../assets/images/plane.png';
import UsersModal from './managerModals/UsersModal';
import CameraModal from './managerModals/CameraModal';
import EmergencyModal from './managerModals/EmergencyModal';
import FlightsListModal from './managerModals/FlightsListModal';
import './css/manager.css';

const Manager = () => {
    const [showUsersModal, setShowUsersModal] = useState(false);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [showEmergencyModal, setEmergencyModal] = useState(false);
    const [showFlightsModal, setShowFlightsModal] = useState(false);

    return (
        <div>
            <div className={`manager-container ${!showUsersModal && !showCameraModal && !showEmergencyModal && !showFlightsModal ? 'visible' : ''}`}>
                <h2 className="modal-title">MANAGER OFFICE</h2>

                <div className="icons-container">

                    <div className="vertical-group">
                        <div className="icon-box" onClick={() => setShowUsersModal(true)}>
                            <div className="icon-wrapper">
                                <PersonIcon style={{ width: '70px', height: '70px' }} />
                            </div>
                            <div className="label-wrapper">USERS</div>
                        </div>

                        <div className="icon-box" onClick={() => setShowCameraModal(true)}>
                            <div className="icon-wrapper">
                                <img
                                    src={cameraIcon}
                                    alt="camera"
                                    style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                                />
                            </div>
                            <div className="label-wrapper">CAMERA</div>
                        </div>
                    </div>

                    <div className="vertical-group">
                        <div className="icon-box" onClick={() => setEmergencyModal(true)}>
                            <div className="icon-wrapper">
                                <img
                                    src={emergencyIcon}
                                    alt="store"
                                    style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                                />
                            </div>
                            <div className="label-wrapper">EMERGENCY</div>
                        </div>

                        <div className="icon-box" onClick={() => setShowFlightsModal(true)}>
                            <div className="icon-wrapper">
                                <img
                                    src={planeIcon}
                                    alt="flights"
                                    style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                                />
                            </div>
                            <div className="label-wrapper">FLIGHTS LIST</div>
                        </div>
                    </div>
                </div>
            </div>
            <UsersModal showModal={showUsersModal} setShowModal={setShowUsersModal} />
            <CameraModal showModal={showCameraModal} setShowModal={setShowCameraModal} />
            <EmergencyModal showModal={showEmergencyModal} setShowModal={setEmergencyModal}/>
            <FlightsListModal showModal={showFlightsModal} setShowModal={setShowFlightsModal} />
        </div>
    );
};

export default Manager;
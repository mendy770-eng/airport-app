import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import cameraIcon from '../assets/images/camera.png';
import storeIcon from '../assets/images/store.png';
import planeIcon from '../assets/images/plane.png';
import UsersModal from './managerModals/UsersModal';
import CameraModal from './managerModals/CameraModal';
import StoreModal from './managerModals/StoreModal';
import FlightsListModal from './managerModals/FlightsListModal';
import './css/manager.css';
import { useEmergency } from '../utils/useEmergency';

const Manager = () => {
    const [showUsersModal, setShowUsersModal] = useState(false);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [showStoreModal, setShowStoreModal] = useState(false);
    const [showFlightsModal, setShowFlightsModal] = useState(false);
    const { isEmergency, emergencyTime } = useEmergency();

    return (
        <>
            <div className={`manager-container ${!showUsersModal && !showCameraModal && !showStoreModal && !showFlightsModal ? 'visible' : ''}`}>
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
                        <div className="icon-box" onClick={() => setShowStoreModal(true)}>
                            <div className="icon-wrapper">
                                <img
                                    src={storeIcon}
                                    alt="store"
                                    style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                                />
                            </div>
                            <div className="label-wrapper">STORE</div>
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
            <div className={`emergency-banner ${isEmergency ? 'emergency' : ''}`}>
                <h2>
                    Emergency status: 
                    <span className={isEmergency ? 'status-emergency' : 'status-free'}>
                        {isEmergency 
                            ? `Emergency situation declared by the inspector at ${emergencyTime?.toLocaleTimeString()}` 
                            : 'all clear'
                        }
                    </span>
                </h2>
            </div>
            <UsersModal
                showModal={showUsersModal}
                setShowModal={setShowUsersModal}
            />
            <CameraModal showModal={showCameraModal} setShowModal={setShowCameraModal} />
            <StoreModal showModal={showStoreModal} setShowModal={setShowStoreModal} />
            <FlightsListModal showModal={showFlightsModal} setShowModal={setShowFlightsModal} />
        </>
    );
};

export default Manager;
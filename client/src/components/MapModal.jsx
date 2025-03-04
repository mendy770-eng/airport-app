import AirportInspector from '../dashboard/AirportInspector';
import Manager from '../dashboard/Manager';
import Technician from '../dashboard/Technician.jsx';
import GroundAttendant from '../dashboard/GroundAttendant.jsx';
import './css/map.css';

const MapModal = ({ type, onClose }) => {
    const renderContent = () => {
        switch (type) {
            case 'airportInspector':
                return <AirportInspector />;
            case 'manager':
                return <Manager />;
            case 'technicion':
                return <Technician />;
            case 'groundAttendant':
                return < GroundAttendant/>;
        }
    };

    return (
        <div className="modal-container">
            <button className="close-button" onClick={onClose}>✕</button>
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default MapModal; 
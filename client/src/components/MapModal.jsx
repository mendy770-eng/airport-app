import AirportInspector from '../dashboard/AirportInspector';
import Manager from '../dashboard/Manager';
import './css/map.css';

const MapModal = ({ type, onClose }) => {
    const renderContent = () => {
        switch (type) {
            case 'airport_inspector':
                return <AirportInspector />;
            case 'manager':
                return <Manager />;
            default:
                return <div>{type} component</div>;
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
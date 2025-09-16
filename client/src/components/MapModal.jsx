import { useContext } from 'react';
import { UserContext } from './UserContext';
import AirportInspector from '../dashboard/AirportInspector';
import Manager from '../dashboard/Manager';
import Technician from '../dashboard/Technician.jsx';
import GroundAttendant from '../dashboard/GroundAttendant.jsx';
import AuthenticationIndicator from './AuthenticationIndicator';
import './css/map.css';

const MapModal = ({ type, onClose }) => {
    const { user } = useContext(UserContext) || {};

    const getUserRole = () => {
        if (user && (user.permission || user.role)) {
            return user.permission || user.role;
        }
        return null; // when no user in context, treat as not authenticated
    };

    // kept minimal auth helper logic inside renderProtected

    const ROLE_ALLOW = {
        airportInspector: ['airportInspector', 'manager'],
        manager: ['manager'],
        technicion: ['technician', 'manager'], // marker key is 'technicion', role is 'technician'
        groundAttendant: ['groundAttendant', 'manager']
    };

    const renderProtected = (component, allowKey) => {
        const role = getUserRole();
        if (!role) return <AuthenticationIndicator />;
        return ROLE_ALLOW[allowKey]?.includes(role) ? component : <AuthenticationIndicator />;
    };

    const renderContent = () => {
        switch (type) {
            case 'airportInspector':
                return renderProtected(<AirportInspector />, 'airportInspector');
            case 'manager':
                return renderProtected(<Manager />, 'manager');
            case 'technicion':
                return renderProtected(<Technician />, 'technicion');
            case 'groundAttendant':
                return renderProtected(< GroundAttendant/>, 'groundAttendant');
            default:
                return <AuthenticationIndicator />;
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
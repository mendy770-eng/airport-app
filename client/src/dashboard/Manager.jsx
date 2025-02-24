import {useState} from 'react';
import GateIcon from '../assets/images/managerOffice.png';
import './css/manager.css';

const Manager = ({ userType }) => {
    const [isActive, setIsActive] = useState(false);

    const handleInspectorClick = () => {
        setIsActive(!isActive);
    };

    if (userType !== 'manager') return null;

    return (
        <div className="manager-container">
            <button 
                onClick={handleInspectorClick}
                className="manager-button"
            >
                <img 
                    src={GateIcon} 
                    alt="Manager" 
                    className={`manager-icon ${isActive ? 'active' : ''}`}
                />
            </button>
        </div>
    );
};

export default Manager;
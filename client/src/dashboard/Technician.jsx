import {useState} from 'react';
import GateIcon from '../assets/images/hangers.png';
import './css/technician.css';

const Technician = ({ isTechnician }) => {
    const [isActive, setIsActive] = useState(false);

    const handleInspectorClick = () => {
        setIsActive(!isActive);
    };

    if (!isTechnician) return null;

    return (
        <div className="technicion-container">
            <button 
                onClick={handleInspectorClick}
                className="technicion-button"
            >
                <img 
                    src={GateIcon} 
                    alt="Technician" 
                    className={`technicion-icon ${isActive ? 'active' : ''}`}
                />
            </button>
        </div>
    );
};

export default Technician;
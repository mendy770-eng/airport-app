import {useState} from 'react';
import GateIcon from '../assets/images/ground attendant.png';
import './css/groundattendat.css';

export default function GroundAttendat() {
    const [isActive, setIsActive] = useState(false);

    const handleInspectorClick = () => {
        setIsActive(!isActive);
    };

    return (
        <div className="attendat-container">
            <button 
                onClick={handleInspectorClick}
                className="inspector-button"
            >
                <img 
                    src={GateIcon} 
                    alt="ground attendat" 
                    className={`attendat-icon ${isActive ? 'active' : ''}`}
                />
            </button>
        </div>
    );
};
import { useState } from 'react';
import './css/technician.css';
import fuelPump from '../assets/images/fuelPump.png';
import Wing from '../assets/images/wing.png';
import Wrench from '../assets/images/wrench.png';
import FrontWheel from '../assets/images/frontWheel.png';

const Technician = () => {
    const [quantities, setQuantities] = useState({
        fuelPump: 0,
        wing: 0,
        wrench: 0,
        frontWheel: 0
    });

    const handleUse = (tool) => {
        setQuantities(prev => ({
            ...prev,
            [tool]: prev[tool] > 0 ? prev[tool] - 1 : 0
        }));
    };

    const handleAdd = (tool) => {
        setQuantities(prev => ({
            ...prev,
            [tool]: prev[tool] + 1
        }));
    };

    return <div>
        <h1 className='tools-title'>TOOLS</h1>
        <div className='technician-container'>

            <div className='line'>
                <div className='technician-tool-type'>
                    <img src={fuelPump} alt='fuelPump' className='tool-image'/>
                    <div className='tool-description'>Fuel Pump</div>
                    <div>current quantity: <span className='current-quantity'>{quantities.fuelPump}</span></div>
                    <div className='buttons-container'>
                        <div className='usage-button' onClick={() => handleUse('fuelPump')}>use</div>
                        <div className='add-button-technician' onClick={() => handleAdd('fuelPump')}>add</div>
                    </div>
                </div>
                <div className='technician-tool-type'>
                    <img src={Wing} alt='Wing' className='tool-image'/>
                    <div className='tool-description'>Wing</div>
                    <div>current quantity: <span className='current-quantity'>{quantities.wing}</span></div>
                    <div className='buttons-container'>
                        <div className='usage-button' onClick={() => handleUse('wing')}>use</div>
                        <div className='add-button-technician' onClick={() => handleAdd('wing')}>add</div>
                    </div>
                </div>
            </div>

            <div className='line'>
                <div className='technician-tool-type'>
                    <img src={Wrench} alt='Wrench' className='tool-image'/>
                    <div className='tool-description'>Wrench</div>
                    <div>current quantity: <span className='current-quantity'>{quantities.wrench}</span></div>
                    <div className='buttons-container'>
                        <div className='usage-button' onClick={() => handleUse('wrench')}>use</div>
                        <div className='add-button-technician' onClick={() => handleAdd('wrench')}>add</div>
                    </div>
                </div>
                <div className='technician-tool-type'>
                    <img src={FrontWheel} alt='FrontWheel' className='tool-image'/>
                    <div className='tool-description'>Front Wheel</div>
                    <div>current quantity: <span className='current-quantity'>{quantities.frontWheel}</span></div>
                    <div className='buttons-container'>
                        <div className='usage-button' onClick={() => handleUse('frontWheel')}>use</div>
                        <div className='add-button-technician' onClick={() => handleAdd('frontWheel')}>add</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default Technician;
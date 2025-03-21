import './css/GroundAttendant.css';
import { useState } from 'react';
import PassangerList from './Ground Attendant modals/PassangerListModal.jsx'
import NewPassangerModal from './Ground Attendant modals/NewPassangermodal.jsx'

export default function GroundAttendant() {
    const [passengerName, setPassengerName] = useState('');
    const [indicationMessage, setIndicationMessage] = useState('');
    const [showPassangersListModal, setPassengerListModal] = useState(false);
    const [showNewPassangerModal, setNewPassangerModal] = useState(false);


    const handleSearch = async () => {
        try {
            const response = await fetch(`/api/passengers?name=${passengerName}`);
            if (!response.ok) throw new Error('Passenger not found');
            const data = await response.json();
            if (data.length === 0) {
                setIndicationMessage("Passenger's name doesn't exist in the system");
            } else {
                setIndicationMessage(`Passenger found: ${data[0].name}`);
            }
        } catch {
            setIndicationMessage("Passenger's name doesn't exist in the system");
        }
    };

    return <div className='groundAttendantWinddow'>
        <h1 className='bording-title'>bording terminal</h1>
        <div className='searching-bar'>
            <h4>Type the passengers name: </h4><input
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
            /><button onClick={handleSearch}>search</button>
        </div>
        <div className='indication-bar'>
            {indicationMessage}
        </div>
        <div className='buttons-container'>
            <div className='button-shape' onClick={() => setPassengerListModal(true)}>GET ALL THE PASSANGERS</div>
            <div className='button-shape' onClick={() => setNewPassangerModal(true)}>ADD A NEW PASSANGER</div>
        </div>
        <PassangerList showModal={showPassangersListModal} setShowModal={setPassengerListModal} />
        <NewPassangerModal showModal={showNewPassangerModal} setShowModal={setNewPassangerModal} />
    </div>
};
import './css/GroundAttendant.css';
import { useState, useEffect } from 'react';
import PassangerList from './Ground Attendant modals/PassangerListModal.jsx'
import NewPassangerModal from './Ground Attendant modals/NewPassangermodal.jsx'

export default function GroundAttendant() {
    const [passengerName, setPassengerName] = useState('');
    const [indicationMessage, setIndicationMessage] = useState('');
    const [showPassangersListModal, setPassengerListModal] = useState(false);
    const [showNewPassangerModal, setNewPassangerModal] = useState(false);
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState('');
    const [boardedCounts, setBoardedCounts] = useState({});

    // טעינת רשימת הטיסות והנוסעים
    useEffect(() => {
        const fetchData = async () => {
            try {
                // טעינת טיסות
                const flightsResponse = await fetch('/api/flights');
                if (!flightsResponse.ok) throw new Error('Failed to fetch flights');
                const flightsData = await flightsResponse.json();
                setFlights(flightsData);
                console.log('Loaded flights:', flightsData);

                // טעינת נוסעים
                const passengersResponse = await fetch('/api/passengers');
                if (!passengersResponse.ok) throw new Error('Failed to fetch passengers');
                const passengersData = await passengersResponse.json();
                console.log('Loaded passengers:', passengersData);

                // עדכון מונה הנוסעים לכל טיסה
                const counts = {};
                passengersData.forEach(passenger => {
                    if (passenger.boarded) {
                        counts[passenger.flightNumber] = (counts[passenger.flightNumber] || 0) + 1;
                    }
                });
                setBoardedCounts(counts);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSearch = async () => {
        if (!selectedFlight) {
            setIndicationMessage("Please select a flight first");
            return;
        }

        try {
            console.log('Searching for:', { flight: selectedFlight, name: passengerName });
            
            const response = await fetch(`/api/passengers/search?name=${passengerName}&flight=${selectedFlight}`);
            if (!response.ok) {
                console.error('Search failed:', response.status, response.statusText);
                throw new Error('Search failed');
            }
            
            const data = await response.json();
            console.log('Search results:', data);
            
            if (data.length === 0) {
                setIndicationMessage("The passenger isn't registered for the flight");
            } else {
                const passenger = data[0];
                setIndicationMessage(
                    <div className="passenger-found">
                        <div>The passenger registered</div>
                        {passenger.boarded === true ? (
                            <button 
                                className="got-off-button"
                                onClick={() => handleGotOff(passenger)}
                            >
                                Got off the flight
                            </button>
                        ) : (
                            <button 
                                className="board-button"
                                onClick={() => handleBoarding(passenger)}
                            >
                                Boarded
                            </button>
                        )}
                    </div>
                );
            }
        } catch (error) {
            console.error('Search error:', error);
            setIndicationMessage("Search failed. Please try again.");
        }
    };

    const handleBoarding = async (passenger) => {
        try {
            const response = await fetch('/api/passengers/board', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    passengerId: passenger._id,
                    boarded: true
                })
            });

            if (!response.ok) throw new Error('Boarding failed');
            
            await response.json();
            setBoardedCounts(prev => ({
                ...prev,
                [selectedFlight]: (prev[selectedFlight] || 0) + 1
            }));
            setIndicationMessage("Passenger successfully boarded!");
            handleSearch();
        } catch (error) {
            console.error('Error boarding passenger:', error);
            setIndicationMessage("Boarding failed. Please try again.");
        }
    };

    const handleGotOff = async (passenger) => {
        try {
            const response = await fetch('/api/passengers/board', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    passengerId: passenger._id,
                    boarded: false  // מציין במפורש שרוצים לרדת מהמטוס
                })
            });

            if (!response.ok) throw new Error('Failed to update boarding status');
            
            await response.json();
            setBoardedCounts(prev => ({
                ...prev,
                [selectedFlight]: Math.max(0, (prev[selectedFlight] || 0) - 1)
            }));
            setIndicationMessage("Passenger got off the flight!");
            
            // עדכון מיידי של התצוגה
            handleSearch();
        } catch (error) {
            console.error('Error updating passenger status:', error);
            setIndicationMessage("Failed to update passenger status. Please try again.");
        }
    };

    // עדכון התצוגה בהתאם למספר הנוסעים בטיסה הנבחרת
    const getBoardingStatus = () => {
        if (!selectedFlight) return null;
        const count = boardedCounts[selectedFlight] || 0;
        if (count >= 10) {
            return <div className="flight-full">The flight is full</div>;
        }
        return <div><span>{count} </span>Passangers boarded from 10</div>;
    };

    return <div className='groundAttendantWinddow'>
        <h1 className='bording-title'>bording terminal</h1>
        <select 
            value={selectedFlight}
            onChange={(e) => setSelectedFlight(e.target.value)}
            className='flight-select'
        >
            <option value="">Select Flight Number</option>
            {flights.map((flight) => (
                <option key={flight.flightNumber} value={flight.flightNumber}>
                    Flight {flight.flightNumber} - {flight.source} to {flight.destination}
                </option>
            ))}
        </select>
        {getBoardingStatus()}
        <div className='searching-bar'>
            <h4>Type the passengers name: </h4>
            <input
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                disabled={!selectedFlight}
            />
            <button 
                onClick={handleSearch}
                disabled={!selectedFlight}
            >
                search
            </button>
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
const Passenger = require('./passengerModel');

// יצירת נוסע
const createPassenger = async (req, res) => {
    try {
        const passenger = await Passenger.create({
            ...req.body,
            boarded: false // וידוא שהשדה borded מוגדר כ-false
        });
        res.status(201).json(passenger);
    } catch (error) {
        console.error('Error creating passenger:', error);
        res.status(500).json({ message: error.message });
    }
};

// קבלת כל הנוסעים
const getAllPassengers = async (req, res) => {
    try {
        const passengers = await Passenger.find();
        console.log('Fetched passengers:', passengers);
        res.status(200).json(passengers);
    } catch (error) {
        console.error('Error in getAllPassengers:', error);
        res.status(500).json({ message: error.message });
    }
}   

// קבלת נוסע לפי מספר טיסה
const getPassengerByFlightNumber = async (req, res) => {
    const { flightNumber } = req.params;

    try {   
        const passengers = await Passenger.find({ flightNumber });
        res.status(200).json(passengers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   

// עדכון נוסע
const updatePassenger = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;    

    try {
        const passenger = await Passenger.findByIdAndUpdate(id, { name, email, phone }, { new: true });
        res.status(200).json(passenger);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   

// מחיקת נוסע
const deletePassenger = async (req, res) => {
    const { id } = req.params;

    try {   
        await Passenger.findByIdAndDelete(id);
        res.status(200).json({ message: 'Passenger deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { 
    createPassenger,
    getAllPassengers,
    getPassengerByFlightNumber, 
    updatePassenger, 
    deletePassenger };
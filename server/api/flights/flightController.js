const { log } = require('console');
const Flight = require('./flightModel');
const path = require('path');
const fs = require('fs').promises;

const createFlight = async (req, res) => {
    try {
        const { flightNumber, departure, destination, source, arrival } = req.body;
        const flight = new Flight({ flightNumber, departure, destination, source, arrival });
        await flight.save();
        res.status(201).json(flight);
    } catch (error) {
        console.error('Error creating flight:', error);
        res.status(500).json({ message: 'Failed to create flight', error: error.toString() });
    }
};

const getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.find();
        res.status(200).json(flights);
        console.log({flights});
        
    } catch (error) {
        console.error('Error fetching flights:', error);
        res.status(500).json({ message: 'Failed to fetch flights', error: error.toString() });
    }
}

const getFlightById = async (req, res) => {
    const { id } = req.params;
    const flight = await Flight.findById(id);
    res.status(200).json(flight);
}

const updateFlight = async (req, res) => {
    const { id } = req.params;
    const { flightNumber, departure, destination, source, arrival } = req.body;
    const flight = await Flight.findByIdAndUpdate(id, { flightNumber, departure, destination, source, arrival },
         { new: true });
    res.status(200).json(flight);
}

const deleteFlight = async (req, res) => {
    try {
        const { id } = req.params;
        await Flight.findByIdAndDelete(id);
        res.status(200).json({ message: 'Flight deleted successfully' });
    } catch (error) {
        console.error('Error deleting flight:', error);
        res.status(500).json({ message: 'Failed to delete flight', error: error.toString() });
    }
};

const getLiveFlights = async (req, res) => {
    try {
        const jsonPath = path.join(__dirname, '../../flights.json');
        const data = await fs.readFile(jsonPath, 'utf8');
        const flightsData = JSON.parse(data);
        
        const flights = flightsData.flights.map(flight => ({
            flightNumber: flight.flightNumber,
            departure: {
                time: flight.departure,
                airport: flight.source
            },
            arrival: {
                time: flight.arrival,
                airport: flight.destination
            }
        }));

        res.json(flights);
    } catch (error) {
        console.error('Error fetching live flights:', error);
        res.status(500).json({ 
            message: 'Failed to fetch live flights',
            error: error.toString()
        });
    }
};

module.exports = { 
    createFlight, 
    getAllFlights, 
    getFlightById, 
    updateFlight, 
    deleteFlight, 
    getLiveFlights };
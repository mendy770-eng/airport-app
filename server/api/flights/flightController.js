const Flight = require('./flightModel');

const createFlight = async (req, res) => {
    const { flightNumber, departure, destination, departureTime, arrivalTime, status, aircraft, passengers } = req.body;
    const flight = new Flight({ flightNumber, departure, destination, departureTime, arrivalTime, status, aircraft, passengers });
    await flight.save();
    res.status(201).json(flight);
}

const getAllFlights = async (req, res) => {
    const flights = await Flight.find();
    res.status(200).json(flights);
}

const getFlightById = async (req, res) => {
    const { id } = req.params;
    const flight = await Flight.findById(id);
    res.status(200).json(flight);
}

const updateFlight = async (req, res) => {
    const { id } = req.params;
    const { flightNumber, departure, destination, departureTime, arrivalTime, status, aircraft, passengers } = req.body;
    const flight = await Flight.findByIdAndUpdate(id, { flightNumber, departure, destination, departureTime, arrivalTime, status, aircraft, passengers }, { new: true });
    res.status(200).json(flight);
}

const deleteFlight = async (req, res) => {
    const { id } = req.params;
    await Flight.findByIdAndDelete(id);
    res.status(200).json({ message: 'Flight deleted successfully' });
}

module.exports = { createFlight, getAllFlights, getFlightById, updateFlight, deleteFlight };
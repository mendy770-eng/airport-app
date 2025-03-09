const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    DateOfBirth: {
        type: Date,
        required: true
    },
    flightNumber: {
        type: String,
        required: true
    }
});

const Passenger = mongoose.model('Passenger', passengerSchema);
module.exports = Passenger;

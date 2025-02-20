const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flightNumber: {
        type: String,
        required: true,
        unique: true
    },
    departure: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    departureTime: {
        type: Date,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'delayed', 'cancelled'],
        default: 'scheduled'
    },
    aircraft: {
        type: String,
        required: true  
    },
    passengers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Passenger',
        required: true
    }
})

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
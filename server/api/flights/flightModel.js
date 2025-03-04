const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flightNumber: {
        type: String,
        required: true,
        unique: true
    },
    arrival: {
        type: Date,
        required: true
    },
    departure: {
        type: Date,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
})

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
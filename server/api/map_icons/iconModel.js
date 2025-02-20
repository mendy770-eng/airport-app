const mongoose = require('mongoose');

const iconSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    location: {
        type: {
            longitude: {
                type: Number,
                required: true
            },
            latitude: {
                type: Number,
                required: true
            }
        },
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['managerOffice', 'controlTower', 'hanger', 'gate'],
    }

});

module.exports = mongoose.model('Icon', iconSchema);
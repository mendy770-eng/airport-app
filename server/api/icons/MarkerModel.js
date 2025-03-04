const mongoose = require('mongoose');

const markerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  position: {
    lat: Number,
    lng: Number
  },
  type: {
    type: String,
    enum: ['airport', 'control_tower'],
    default: 'airport'
  }
});

const Marker = mongoose.model('Marker', markerSchema);
module.exports = Marker; 
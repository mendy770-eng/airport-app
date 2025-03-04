const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const { 
    createFlight, 
    getAllFlights, 
    getFlightById, 
    updateFlight, 
    deleteFlight,
    getLiveFlights 
} = require('./flightController');
// קבלת נתוני טיסות חיות מקובץ
router.get('/live', getLiveFlights);

// יצירת טיסה
router.post('/', createFlight);

// קבלת כל הטיסות
router.get('/', getAllFlights);

// קבלת טיסה לפי מספר טיסה
router.get('/:id', getFlightById);

// עדכון טיסה
router.put('/:id', updateFlight);

// מחיקת טיסה
router.delete('/:id', deleteFlight);

module.exports = router;
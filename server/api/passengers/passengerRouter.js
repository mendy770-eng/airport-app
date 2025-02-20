const express = require('express');
const router = express.Router();
const { createPassenger, getAllPassengers, getPassengerByFlightNumber, updatePassenger, deletePassenger } = require('./passengerController');


//יצירת נוסע
router.post('/', createPassenger);
//קבלת כל הנוסעים
router.get('/', getAllPassengers);
//קבלת נוסע לפי מספר טיסה
router.get('/:flightNumber', getPassengerByFlightNumber);
//עדכון נוסע
router.put('/:id', updatePassenger);
//מחיקת נוסע
router.delete('/:id', deletePassenger);

module.exports = router;
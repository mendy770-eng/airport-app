const express = require('express');
const router = express.Router();
const { createPassenger,
        getAllPassengers,
        getPassengerByFlightNumber, 
        updatePassenger, 
        deletePassenger,
        boardPassenger,
        getPassengerByNameAndFlight,
        getPassengers } = require('./passengerController');

// סדר הנתיבים חשוב - ספציפי לפני כללי
router.post('/board', boardPassenger);
router.get('/search', getPassengerByNameAndFlight);
router.put('/:id', updatePassenger);
router.delete('/:id', deletePassenger);
router.post('/', createPassenger);
router.get('/', getPassengers);

module.exports = router;
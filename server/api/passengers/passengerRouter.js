const express = require('express');
const router = express.Router();
const { createPassenger,
        getAllPassengers,
        getPassengerByFlightNumber, 
        updatePassenger, 
        deletePassenger,
        boardPassenger,
        getPassengerByNameAndFlight } = require('./passengerController');

// סדר הנתיבים חשוב - ספציפי לפני כללי
router.post('/board', boardPassenger);
router.get('/search', getPassengerByNameAndFlight);  // קודם הנתיב הספציפי
router.get('/:flightNumber', getPassengerByFlightNumber);
router.put('/:id', updatePassenger);
router.delete('/:id', deletePassenger);
router.post('/', createPassenger);
router.get('/', getAllPassengers);  // הנתיב הכללי בסוף

module.exports = router;
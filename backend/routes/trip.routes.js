const express = require('express');
const {
    createTrip,
    getTrips,
    dispatchTrip,
    completeTrip,
    cancelTrip,
} = require('../controllers/trip.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getTrips)
    .post(authorize('Dispatcher', 'Fleet Manager'), createTrip);

router.post('/:id/dispatch', authorize('Dispatcher', 'Fleet Manager'), dispatchTrip);
router.post('/:id/complete', authorize('Dispatcher', 'Fleet Manager'), completeTrip);
router.post('/:id/cancel', authorize('Dispatcher', 'Fleet Manager'), cancelTrip);

module.exports = router;

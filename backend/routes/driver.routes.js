const express = require('express');
const {
    createDriver,
    getDrivers,
    getDriver,
    updateDriver,
    addComplaint,
} = require('../controllers/driver.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getDrivers)
    .post(authorize('Fleet Manager', 'Safety Officer'), createDriver);

router
    .route('/:id')
    .get(getDriver)
    .put(authorize('Fleet Manager', 'Safety Officer'), updateDriver);

router.post('/:id/complaint', authorize('Safety Officer'), addComplaint);

module.exports = router;

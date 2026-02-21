const express = require('express');
const {
    createVehicle,
    getVehicles,
    getVehicle,
    updateVehicle,
} = require('../controllers/vehicle.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getVehicles)
    .post(authorize('Fleet Manager'), createVehicle);

router
    .route('/:id')
    .get(getVehicle)
    .put(authorize('Fleet Manager'), updateVehicle);

module.exports = router;

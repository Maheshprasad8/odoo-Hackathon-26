const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    licensePlate: {
        type: String,
        required: [true, 'Please provide a license plate'],
        unique: true,
        uppercase: true,
        trim: true,
    },
    model: {
        type: String,
        required: [true, 'Please provide a model'],
    },
    type: {
        type: String,
        enum: ['Truck', 'Van', 'Bike'],
        required: [true, 'Please provide a type'],
    },
    maxLoadCapacity: {
        type: Number,
        required: [true, 'Please provide max load capacity in kg'],
    },
    odometer: {
        type: Number,
        required: [true, 'Please provide initial odometer reading'],
        min: 0,
    },
    region: {
        type: String,
        required: [true, 'Please provide a region'],
    },
    status: {
        type: String,
        enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
        default: 'Available',
    },
    lastMaintenanceDate: {
        type: Date,
    },
    lastTripDate: {
        type: Date,
        default: Date.now,
    },
    acquisitionCost: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);

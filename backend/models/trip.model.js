const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: [true, 'Please provide a vehicle'],
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: [true, 'Please provide a driver'],
    },
    cargoWeight: {
        type: Number,
        required: [true, 'Please provide cargo weight'],
    },
    origin: {
        type: String,
        required: [true, 'Please provide origin'],
    },
    destination: {
        type: String,
        required: [true, 'Please provide destination'],
    },
    estimatedFuelCost: {
        type: Number,
        required: [true, 'Please provide estimated fuel cost'],
    },
    actualFuelCost: {
        type: Number,
    },
    revenue: {
        type: Number,
        required: [true, 'Please provide revenue'],
    },
    status: {
        type: String,
        enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
        default: 'Draft',
    },
    startTime: {
        type: Date,
    },
    endTime: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Trip', tripSchema);

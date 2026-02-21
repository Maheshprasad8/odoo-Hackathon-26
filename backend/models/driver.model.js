const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    licenseNumber: {
        type: String,
        required: [true, 'Please provide a license number'],
        unique: true,
    },
    licenseExpiryDate: {
        type: Date,
        required: [true, 'Please provide license expiry date'],
    },
    status: {
        type: String,
        enum: ['On Duty', 'Off Duty', 'On Trip', 'Suspended'],
        default: 'On Duty',
    },
    licenseCategory: {
        type: String,
        enum: ['Truck', 'Van', 'Bike'],
        required: [true, 'Please provide a license category'],
    },
    safetyScore: {
        type: Number,
        default: 10,
        min: 0,
        max: 10,
    },
    totalTrips: {
        type: Number,
        default: 0,
    },
    completedTrips: {
        type: Number,
        default: 0,
    },
    complaintsCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Auto-suspend driver if license is expired
driverSchema.pre('save', function (next) {
    if (this.licenseExpiryDate < new Date()) {
        this.status = 'Suspended';
    }
    next();
});

module.exports = mongoose.model('Driver', driverSchema);

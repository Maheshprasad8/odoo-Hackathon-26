const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: [true, 'Please provide a vehicle'],
    },
    type: {
        type: String,
        enum: ['Fuel', 'Maintenance'],
        required: [true, 'Please provide expense type'],
    },
    amount: {
        type: Number,
        required: [true, 'Please provide amount'],
    },
    liters: {
        type: Number,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Expense', expenseSchema);

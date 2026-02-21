const Trip = require('../models/trip.model');

class TripRepository {
    async create(data) {
        return await Trip.create(data);
    }

    async findById(id) {
        return await Trip.findById(id).populate('vehicle driver');
    }

    async findAll(filter = {}, options = {}) {
        const { sort = { createdAt: -1 }, limit = 10, skip = 0 } = options;
        return await Trip.find(filter).populate('vehicle driver').sort(sort).limit(limit).skip(skip);
    }

    async update(id, data) {
        return await Trip.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate('vehicle driver');
    }

    async countDocuments(filter = {}) {
        return await Trip.countDocuments(filter);
    }
}

module.exports = new TripRepository();

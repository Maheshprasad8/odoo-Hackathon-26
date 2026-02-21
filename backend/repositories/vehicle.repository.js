const Vehicle = require('../models/vehicle.model');

class VehicleRepository {
    async create(data) {
        return await Vehicle.create(data);
    }

    async findById(id) {
        return await Vehicle.findById(id);
    }

    async findOne(filter) {
        return await Vehicle.findOne(filter);
    }

    async findAll(filter = {}, options = {}) {
        const { sort = { createdAt: -1 }, limit = 10, skip = 0 } = options;
        return await Vehicle.find(filter).sort(sort).limit(limit).skip(skip);
    }

    async countDocuments(filter = {}) {
        return await Vehicle.countDocuments(filter);
    }

    async update(id, data) {
        return await Vehicle.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }

    async delete(id) {
        return await Vehicle.findByIdAndDelete(id);
    }
}

module.exports = new VehicleRepository();

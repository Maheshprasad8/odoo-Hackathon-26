const Driver = require('../models/driver.model');

class DriverRepository {
    async create(data) {
        return await Driver.create(data);
    }

    async findById(id) {
        return await Driver.findById(id);
    }

    async findOne(filter) {
        return await Driver.findOne(filter);
    }

    async findAll(filter = {}, options = {}) {
        const { sort = { createdAt: -1 }, limit = 10, skip = 0 } = options;
        return await Driver.find(filter).sort(sort).limit(limit).skip(skip);
    }

    async update(id, data) {
        return await Driver.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }

    async delete(id) {
        return await Driver.findByIdAndDelete(id);
    }
}

module.exports = new DriverRepository();

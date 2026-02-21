const driverRepository = require('../repositories/driver.repository');

class DriverService {
    async registerDriver(data) {
        const existingDriver = await driverRepository.findOne({ licenseNumber: data.licenseNumber });
        if (existingDriver) {
            throw new Error('Driver with this license number already exists');
        }
        return await driverRepository.create(data);
    }

    async getDriverById(id) {
        const driver = await driverRepository.findById(id);
        if (!driver) {
            throw new Error('Driver not found');
        }
        return driver;
    }

    async getAllDrivers(filter, options) {
        return await driverRepository.findAll(filter, options);
    }

    async updateDriver(id, data) {
        return await driverRepository.update(id, data);
    }

    async calculateSafetyScore(id) {
        const driver = await this.getDriverById(id);

        const completionRate = driver.totalTrips > 0
            ? (driver.completedTrips / driver.totalTrips) * 10
            : 10;

        const penalty = driver.complaintsCount * 2;

        let score = completionRate - penalty;
        score = Math.max(0, Math.min(10, score)); // Clamp between 0 and 10

        return await driverRepository.update(id, { safetyScore: score });
    }

    async reportComplaint(id) {
        const driver = await this.getDriverById(id);
        await driverRepository.update(id, { $inc: { complaintsCount: 1 } });
        return await this.calculateSafetyScore(id);
    }
}

module.exports = new DriverService();

const vehicleRepository = require('../repositories/vehicle.repository');

class VehicleService {
    async registerVehicle(data) {
        const existingVehicle = await vehicleRepository.findOne({ licensePlate: data.licensePlate });
        if (existingVehicle) {
            throw new Error('Vehicle with this license plate already exists');
        }
        return await vehicleRepository.create(data);
    }

    async getVehicleById(id) {
        const vehicle = await vehicleRepository.findById(id);
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }
        return vehicle;
    }

    async updateVehicle(id, data) {
        const vehicle = await this.getVehicleById(id);

        if (data.odometer && data.odometer < vehicle.odometer) {
            throw new Error('Odometer reading cannot decrease');
        }

        return await vehicleRepository.update(id, data);
    }

    async getAllVehicles(filter, options) {
        return await vehicleRepository.findAll(filter, options);
    }

    async getFleetStats() {
        const total = await vehicleRepository.countDocuments();
        const onTrip = await vehicleRepository.countDocuments({ status: 'On Trip' });
        const inShop = await vehicleRepository.countDocuments({ status: 'In Shop' });

        return {
            total,
            onTrip,
            inShop,
            utilizationRate: total > 0 ? (onTrip / total) * 100 : 0
        };
    }
}

module.exports = new VehicleService();

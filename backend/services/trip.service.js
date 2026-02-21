const tripRepository = require('../repositories/trip.repository');
const vehicleService = require('./vehicle.service');
const driverService = require('./driver.service');
const vehicleRepository = require('../repositories/vehicle.repository');
const driverRepository = require('../repositories/driver.repository');

class TripService {
    async createTrip(data) {
        const vehicle = await vehicleService.getVehicleById(data.vehicle);
        const driver = await driverService.getDriverById(data.driver);

        // Rule: cargoWeight > vehicle.maxCapacity
        if (data.cargoWeight > vehicle.maxLoadCapacity) {
            throw new Error(`Cargo weight ${data.cargoWeight}kg exceeds vehicle capacity ${vehicle.maxLoadCapacity}kg`);
        }

        return await tripRepository.create(data);
    }

    async dispatchTrip(id) {
        const trip = await tripRepository.findById(id);
        if (!trip) throw new Error('Trip not found');

        if (trip.status !== 'Draft') {
            throw new Error('Only Draft trips can be dispatched');
        }

        const vehicle = trip.vehicle;
        const driver = trip.driver;

        // Rule: vehicle.status != "Available"
        if (vehicle.status !== 'Available') {
            throw new Error(`Vehicle ${vehicle.licensePlate} is not available (Status: ${vehicle.status})`);
        }

        // Rule: driver.status != "On Duty"
        if (driver.status !== 'On Duty') {
            throw new Error(`Driver ${driver.name} is not on duty (Status: ${driver.status})`);
        }

        // Rule: driver license expired
        if (driver.licenseExpiryDate < new Date()) {
            throw new Error(`Driver ${driver.name} has an expired license`);
        }

        // Rule: licenseCategory match
        if (driver.licenseCategory !== vehicle.type) {
            throw new Error(`Driver ${driver.name} is licensed for ${driver.licenseCategory}, but vehicle is a ${vehicle.type}`);
        }

        // Update Trip status
        const updatedTrip = await tripRepository.update(id, {
            status: 'Dispatched',
            startTime: new Date()
        });

        // Update Vehicle status
        await vehicleRepository.update(vehicle._id, { status: 'On Trip' });

        // Update Driver status
        await driverRepository.update(driver._id, { status: 'On Trip' });

        return updatedTrip;
    }

    async completeTrip(id, { actualFuelCost, finalOdometer }) {
        const trip = await tripRepository.findById(id);
        if (!trip || trip.status !== 'Dispatched') {
            throw new Error('Only dispatched trips can be completed');
        }

        const vehicle = trip.vehicle;

        // Rule: finalOdometer < current odometer
        if (finalOdometer < vehicle.odometer) {
            throw new Error(`Final odometer (${finalOdometer}) cannot be less than current (${vehicle.odometer})`);
        }

        const updatedTrip = await tripRepository.update(id, {
            status: 'Completed',
            endTime: new Date(),
            actualFuelCost
        });

        // Update Vehicle status & odometer
        await vehicleRepository.update(vehicle._id, {
            status: 'Available',
            odometer: finalOdometer,
            lastTripDate: new Date()
        });

        // Update Driver status & stats
        await driverRepository.update(trip.driver._id, {
            status: 'On Duty',
            $inc: { totalTrips: 1, completedTrips: 1 }
        });

        // Recalculate safety score
        await driverService.calculateSafetyScore(trip.driver._id);

        return updatedTrip;
    }

    async cancelTrip(id) {
        const trip = await tripRepository.findById(id);
        if (!trip || trip.status !== 'Dispatched') {
            throw new Error('Only dispatched trips can be cancelled');
        }

        const updatedTrip = await tripRepository.update(id, { status: 'Cancelled' });

        // Update Vehicle status
        await vehicleRepository.update(trip.vehicle._id, { status: 'Available' });

        // Update Driver status & stats (total increments, but not completed)
        await driverRepository.update(trip.driver._id, {
            status: 'On Duty',
            $inc: { totalTrips: 1 }
        });

        await driverService.calculateSafetyScore(trip.driver._id);

        return updatedTrip;
    }

    async getTrips(filter, options) {
        return await tripRepository.findAll(filter, options);
    }
}

module.exports = new TripService();

const tripService = require('../services/trip.service');
const tripDTO = require('../dto/trip.dto');

const createTrip = async (req, res, next) => {
    try {
        const trip = await tripService.createTrip(req.body);
        res.sendSuccess(tripDTO(trip), 'Trip created as Draft', 201);
    } catch (error) {
        next(error);
    }
};

const getTrips = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const filter = {};
        if (status) filter.status = status;

        const options = {
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
        };

        const trips = await tripService.getTrips(filter, options);
        res.sendSuccess(trips.map(t => tripDTO(t)), 'Trips fetched successfully');
    } catch (error) {
        next(error);
    }
};

const dispatchTrip = async (req, res, next) => {
    try {
        const trip = await tripService.dispatchTrip(req.params.id);
        res.sendSuccess(tripDTO(trip), 'Trip dispatched successfully');
    } catch (error) {
        next(error);
    }
};

const completeTrip = async (req, res, next) => {
    try {
        const { actualFuelCost } = req.body;
        const trip = await tripService.completeTrip(req.params.id, req.body);
        res.sendSuccess(tripDTO(trip), 'Trip completed successfully');
    } catch (error) {
        next(error);
    }
};

const cancelTrip = async (req, res, next) => {
    try {
        const trip = await tripService.cancelTrip(req.params.id);
        res.sendSuccess(tripDTO(trip), 'Trip cancelled successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTrip,
    getTrips,
    dispatchTrip,
    completeTrip,
    cancelTrip,
};

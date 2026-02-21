const driverService = require('../services/driver.service');
const driverDTO = require('../dto/driver.dto');

const createDriver = async (req, res, next) => {
    try {
        const driver = await driverService.registerDriver(req.body);
        res.sendSuccess(driverDTO(driver), 'Driver registered successfully', 201);
    } catch (error) {
        next(error);
    }
};

const getDrivers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const filter = {};
        if (status) filter.status = status;

        const options = {
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
        };

        const drivers = await driverService.getAllDrivers(filter, options);
        res.sendSuccess(drivers.map(d => driverDTO(d)), 'Drivers fetched successfully');
    } catch (error) {
        next(error);
    }
};

const getDriver = async (req, res, next) => {
    try {
        const driver = await driverService.getDriverById(req.params.id);
        res.sendSuccess(driverDTO(driver), 'Driver fetched successfully');
    } catch (error) {
        next(error);
    }
};

const updateDriver = async (req, res, next) => {
    try {
        const driver = await driverService.updateDriver(req.params.id, req.body);
        res.sendSuccess(driverDTO(driver), 'Driver updated successfully');
    } catch (error) {
        next(error);
    }
};

const addComplaint = async (req, res, next) => {
    try {
        const driver = await driverService.reportComplaint(req.params.id);
        res.sendSuccess(driverDTO(driver), 'Complaint reported and score recalculated');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createDriver,
    getDrivers,
    getDriver,
    updateDriver,
    addComplaint,
};

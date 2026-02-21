const vehicleService = require('../services/vehicle.service');
const vehicleDTO = require('../dto/vehicle.dto');

const createVehicle = async (req, res, next) => {
    try {
        const vehicle = await vehicleService.registerVehicle(req.body);
        res.sendSuccess(vehicleDTO(vehicle), 'Vehicle registered successfully', 201);
    } catch (error) {
        next(error);
    }
};

const getVehicles = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status, type, region } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (type) filter.type = type;
        if (region) filter.region = region;

        const options = {
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
        };

        const vehicles = await vehicleService.getAllVehicles(filter, options);
        res.sendSuccess(vehicles.map(v => vehicleDTO(v)), 'Vehicles fetched successfully');
    } catch (error) {
        next(error);
    }
};

const getVehicle = async (req, res, next) => {
    try {
        const vehicle = await vehicleService.getVehicleById(req.params.id);
        res.sendSuccess(vehicleDTO(vehicle), 'Vehicle fetched successfully');
    } catch (error) {
        next(error);
    }
};

const updateVehicle = async (req, res, next) => {
    try {
        const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
        res.sendSuccess(vehicleDTO(vehicle), 'Vehicle updated successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createVehicle,
    getVehicles,
    getVehicle,
    updateVehicle,
};

const vehicleDTO = (vehicle) => {
    return {
        id: vehicle._id,
        licensePlate: vehicle.licensePlate,
        model: vehicle.model,
        type: vehicle.type,
        maxLoadCapacity: vehicle.maxLoadCapacity,
        odometer: vehicle.odometer,
        region: vehicle.region,
        status: vehicle.status,
    };
};

module.exports = vehicleDTO;

const tripDTO = (trip) => {
    return {
        id: trip._id,
        vehicle: trip.vehicle,
        driver: trip.driver,
        cargoWeight: trip.cargoWeight,
        origin: trip.origin,
        destination: trip.destination,
        estimatedFuelCost: trip.estimatedFuelCost,
        actualFuelCost: trip.actualFuelCost,
        revenue: trip.revenue,
        status: trip.status,
        startTime: trip.startTime,
        endTime: trip.endTime,
    };
};

module.exports = tripDTO;

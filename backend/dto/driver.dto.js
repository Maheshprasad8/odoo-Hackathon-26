const driverDTO = (driver) => {
    return {
        id: driver._id,
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        licenseExpiryDate: driver.licenseExpiryDate,
        status: driver.status,
        safetyScore: driver.safetyScore,
        totalTrips: driver.totalTrips,
        completedTrips: driver.completedTrips,
        complaintsCount: driver.complaintsCount,
    };
};

module.exports = driverDTO;

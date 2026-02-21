const Vehicle = require('../models/vehicle.model');
const Trip = require('../models/trip.model');
const Expense = require('../models/expense.model');

class AnalyticsService {
    async getDashboardStats() {
        const activeFleet = await Vehicle.countDocuments({ status: 'On Trip' });
        const maintenanceAlerts = await Vehicle.countDocuments({ status: 'In Shop' });
        const pendingCargo = await Trip.countDocuments({ status: 'Draft' });
        const totalVehicles = await Vehicle.countDocuments();

        const utilizationRate = totalVehicles > 0 ? (activeFleet / totalVehicles) * 100 : 0;

        return {
            activeFleet,
            maintenanceAlerts,
            pendingCargo,
            utilizationRate: utilizationRate.toFixed(2),
            totalVehicles
        };
    }

    async getFinancialSummary() {
        const revenue = await Trip.aggregate([{ $match: { status: 'Completed' } }, { $group: { _id: null, total: { $sum: '$revenue' } } }]);
        const expenses = await Expense.aggregate([{ $group: { _id: '$type', total: { $sum: '$amount' } } }]);

        const totalRevenue = revenue[0]?.total || 0;
        const fuelCost = expenses.find(e => e._id === 'Fuel')?.total || 0;
        const maintenanceCost = expenses.find(e => e._id === 'Maintenance')?.total || 0;
        const totalExpenses = fuelCost + maintenanceCost;

        const vehicles = await Vehicle.find({});
        const totalAcquisitionCost = vehicles.reduce((sum, v) => sum + (v.acquisitionCost || 0), 0);

        const roi = totalAcquisitionCost > 0 ? ((totalRevenue - totalExpenses) / totalAcquisitionCost * 100).toFixed(2) : 0;

        return {
            revenue: totalRevenue,
            fuelCost,
            maintenanceCost,
            netProfit: totalRevenue - totalExpenses,
            roi
        };
    }

    async getDeadStock() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return await Vehicle.find({
            lastTripDate: { $lt: thirtyDaysAgo },
            status: { $ne: 'Retired' }
        });
    }

    async getAssetPerformance() {
        return await Vehicle.aggregate([
            {
                $lookup: {
                    from: 'trips',
                    localField: '_id',
                    foreignField: 'vehicle',
                    as: 'trips'
                }
            },
            {
                $lookup: {
                    from: 'expenses',
                    localField: '_id',
                    foreignField: 'vehicle',
                    as: 'expenses'
                }
            },
            {
                $project: {
                    licensePlate: 1,
                    type: 1,
                    odometer: 1,
                    acquisitionCost: 1,
                    totalRevenue: { $sum: '$trips.revenue' },
                    fuelExpenses: { $filter: { input: '$expenses', as: 'e', cond: { $eq: ['$$e.type', 'Fuel'] } } },
                    maintenanceExpenses: { $filter: { input: '$expenses', as: 'e', cond: { $eq: ['$$e.type', 'Maintenance'] } } }
                }
            },
            {
                $project: {
                    licensePlate: 1,
                    totalRevenue: 1,
                    totalFuelCost: { $sum: '$fuelExpenses.amount' },
                    totalLiters: { $sum: '$fuelExpenses.liters' },
                    totalMaintenanceCost: { $sum: '$maintenanceExpenses.amount' },
                    acquisitionCost: 1,
                    odometer: 1
                }
            },
            {
                $project: {
                    licensePlate: 1,
                    kmPerLiter: { $cond: [{ $gt: ['$totalLiters', 0] }, { $divide: ['$odometer', '$totalLiters'] }, 0] },
                    roi: { $cond: [{ $gt: ['$acquisitionCost', 0] }, { $divide: [{ $subtract: ['$totalRevenue', { $add: ['$totalFuelCost', '$totalMaintenanceCost'] }] }, '$acquisitionCost'] }, 0] }
                }
            }
        ]);
    }
}

module.exports = new AnalyticsService();

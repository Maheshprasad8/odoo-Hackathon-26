const analyticsService = require('../services/analytics.service');

const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await analyticsService.getDashboardStats();
        res.sendSuccess(stats, 'Dashboard stats fetched successfully');
    } catch (error) {
        next(error);
    }
};

const getFinancialSummary = async (req, res, next) => {
    try {
        const summary = await analyticsService.getFinancialSummary();
        res.sendSuccess(summary, 'Financial summary fetched successfully');
    } catch (error) {
        next(error);
    }
};

const getAssetPerformance = async (req, res, next) => {
    try {
        const stats = await analyticsService.getAssetPerformance();
        res.sendSuccess(stats, 'Asset performance stats fetched successfully');
    } catch (error) {
        next(error);
    }
};

const getDeadStock = async (req, res, next) => {
    try {
        const deadStock = await analyticsService.getDeadStock();
        res.sendSuccess(deadStock, 'Dead stock (idle vehicles) fetched successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
    getFinancialSummary,
    getAssetPerformance,
    getDeadStock
};

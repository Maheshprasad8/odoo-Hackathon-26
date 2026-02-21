const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/financials', authorize('Financial Analyst', 'Fleet Manager'), analyticsController.getFinancialSummary);
router.get('/asset-performance', authorize('Financial Analyst', 'Fleet Manager'), analyticsController.getAssetPerformance);
router.get('/dead-stock', authorize('Fleet Manager'), analyticsController.getDeadStock);

module.exports = router;

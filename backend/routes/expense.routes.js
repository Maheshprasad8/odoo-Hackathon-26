const express = require('express');
const Expense = require('../models/expense.model');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

const expenseController = require('../controllers/expense.controller');

router.use(protect);

router.post('/', authorize('Financial Analyst', 'Fleet Manager'), expenseController.logExpense);
router.get('/', authorize('Financial Analyst', 'Fleet Manager'), expenseController.getExpenses);

module.exports = router;

const expenseService = require('../services/expense.service');

const logExpense = async (req, res, next) => {
    try {
        const expense = await expenseService.logExpense(req.body);
        res.sendSuccess(expense, 'Expense logged successfully', 201);
    } catch (err) {
        next(err);
    }
};

const getExpenses = async (req, res, next) => {
    try {
        const expenses = await expenseService.getExpenses(req.query);
        res.sendSuccess(expenses);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    logExpense,
    getExpenses
};

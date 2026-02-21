const Expense = require('../models/expense.model');

class ExpenseRepository {
    async create(data) {
        return await Expense.create(data);
    }

    async findAll(filter = {}) {
        return await Expense.find(filter).populate('vehicle').sort({ date: -1 });
    }

    async getFinancialStats(vehicleId) {
        const stats = await Expense.aggregate([
            { $match: vehicleId ? { vehicle: vehicleId } : {} },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    totalLiters: { $sum: { $ifNull: ['$liters', 0] } }
                }
            }
        ]);
        return stats;
    }
}

module.exports = new ExpenseRepository();

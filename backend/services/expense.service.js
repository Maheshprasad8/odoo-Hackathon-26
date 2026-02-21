const expenseRepository = require('../repositories/expense.repository');
const vehicleRepository = require('../repositories/vehicle.repository');

class ExpenseService {
    async logExpense(data) {
        const expense = await expenseRepository.create(data);

        // Logic Link: Maintenance log entry switches vehicle to "In Shop"
        if (data.type === 'Maintenance') {
            await vehicleRepository.update(data.vehicle, { status: 'In Shop' });
        }

        return expense;
    }

    async getExpenses(filter) {
        return await expenseRepository.findAll(filter);
    }
}

module.exports = new ExpenseService();

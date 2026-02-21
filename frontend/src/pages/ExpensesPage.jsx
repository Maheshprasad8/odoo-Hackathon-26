import React, { useEffect, useState } from 'react';
import { Plus, CreditCard, DollarSign, Calendar, Truck, Wrench } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Modal from '../components/Modal';

const ExpensesPage = () => {
    const { user: currentUser } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        vehicle: '',
        type: 'Fuel',
        amount: '',
        description: '',
    });

    const fetchAll = async () => {
        try {
            const [expensesRes, vehiclesRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/vehicles')
            ]);
            setExpenses(expensesRes.data);
            setVehicles(vehiclesRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/expenses', formData);
            toast.success('Operational expense logged successfully');
            setIsModalOpen(false);
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to log expense');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Operational Expenses</h1>
                    <p className="text-slate-500">Track fuel, maintenance, and repair costs.</p>
                </div>
                {(currentUser?.role === 'Financial Analyst' || currentUser?.role === 'Fleet Manager') && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary flex items-center gap-2 self-start"
                    >
                        <Plus size={20} />
                        Log Expense
                    </button>
                )}
            </header>

            <div className="card !p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Type</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Vehicle</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Amount</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {loading ? (
                            [1, 2, 3].map(i => <tr key={i} className="animate-pulse"><td colSpan="5" className="px-6 py-8"></td></tr>)
                        ) : (
                            expenses.map((expense) => (
                                <tr key={expense._id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 justify-center">
                                            {expense.type === 'Fuel' ? (
                                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                                    <DollarSign size={16} />
                                                </div>
                                            ) : (
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                    <CreditCard size={16} />
                                                </div>
                                            )}
                                            <span className="text-sm font-bold text-slate-700">{expense.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center gap-2 justify-center text-slate-600">
                                            <Truck size={14} />
                                            <span className="text-sm font-medium">{expense.vehicle?.licensePlate || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center gap-2 justify-center text-slate-600 text-sm">
                                            <Calendar size={14} />
                                            {new Date(expense.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm font-black text-slate-900">${expense.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm text-slate-500 truncate max-w-xs block mx-auto">{expense.description || '-'}</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Expense">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Vehicle</label>
                        <select
                            required
                            className="input-field"
                            value={formData.vehicle}
                            onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                        >
                            <option value="">Select Vehicle...</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.licensePlate}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Expense Type</label>
                        <select
                            className="input-field"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Fuel">Fuel</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Amount ($)</label>
                        <input
                            type="number"
                            required
                            className="input-field"
                            placeholder="Amount in USD"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                        <textarea
                            className="input-field h-24 resize-none"
                            placeholder="Optional details..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="btn btn-primary w-full py-4 text-lg">Log Expense</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ExpensesPage;

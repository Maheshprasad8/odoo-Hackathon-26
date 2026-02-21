import React, { useEffect, useState } from 'react';
import { Plus, Wrench, Calendar, Truck, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Modal from '../components/Modal';

const MaintenancePage = () => {
    const { user: currentUser } = useAuth();
    const [logs, setLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        vehicle: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const fetchAll = async () => {
        try {
            const [logsRes, vehiclesRes] = await Promise.all([
                api.get('/expenses?type=Maintenance'),
                api.get('/vehicles')
            ]);
            setLogs(logsRes.data);
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
            await api.post('/expenses', { ...formData, type: 'Maintenance' });
            toast.success('Maintenance record saved & Asset status updated');
            setIsModalOpen(false);
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save maintenance record');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Service Logs</h1>
                    <p className="text-slate-500">Track vehicle maintenance and health history.</p>
                </div>
                {currentUser?.role === 'Fleet Manager' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary flex items-center gap-2 self-start"
                    >
                        <Plus size={20} />
                        Log Service Entry
                    </button>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>)
                ) : (
                    logs.map((log) => (
                        <div key={log._id} className="card border-l-4 border-amber-400">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                        <Wrench size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{log.vehicle?.licensePlate}</p>
                                        <p className="text-xs text-slate-500">{log.vehicle?.model}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-slate-900">${log.amount.toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{log.description}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Calendar size={14} />
                                <span>{new Date(log.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Maintenance Record">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3 mb-4">
                        <AlertCircle className="text-amber-600 shrink-0" size={20} />
                        <p className="text-xs text-amber-800 leading-relaxed">
                            Logging a maintenance entry will automatically set the vehicle status to <strong>"In Shop"</strong>, making it unavailable for dispatch until manually toggled back.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Select Vehicle</label>
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
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Service Cost ($)</label>
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
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                        <input
                            type="date"
                            required
                            className="input-field"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Description of Work</label>
                        <textarea
                            className="input-field h-24 resize-none"
                            placeholder="Optional details..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="btn btn-primary w-full py-4 text-lg">Save Record & Update Asset Status</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MaintenancePage;

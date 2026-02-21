import React, { useEffect, useState } from 'react';
import { Plus, Search, User, Star, Truck, Calendar, ShieldCheck, AlertCircle, Power, PowerOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Modal from '../components/Modal';

const DriversPage = () => {
    const { user: currentUser } = useAuth();
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        licenseNumber: '',
        licenseExpiryDate: '',
        licenseCategory: 'Van',
    });

    const fetchDrivers = async () => {
        try {
            const res = await api.get('/drivers');
            setDrivers(res.data);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to fetch drivers');
        } finally {
            setLoading(false);
        }
    };

    const updateDriverStatus = async (id, status) => {
        try {
            await api.put(`/drivers/${id}`, { status });
            toast.success(`Driver status updated to ${status}`);
            fetchDrivers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update driver status');
        }
    };

    const handleReportIncident = async (id) => {
        try {
            await api.post(`/drivers/${id}/complaint`);
            toast.success('Safety incident reported and score updated');
            fetchDrivers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to report incident');
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/drivers', formData);
            toast.success('Driver onboarded successfully!');
            setIsModalOpen(false);
            fetchDrivers();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to onboard driver');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'On Duty': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'On Trip': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Off Duty': return 'bg-slate-50 text-slate-700 border-slate-200';
            case 'Suspended': return 'bg-rose-50 text-rose-700 border-rose-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Driver Management</h1>
                    <p className="text-slate-500">Monitor driver performance and safety compliance.</p>
                </div>
                {(currentUser?.role === 'Fleet Manager' || currentUser?.role === 'Safety Officer') && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary flex items-center gap-2 self-start"
                    >
                        <Plus size={20} />
                        Register Driver
                    </button>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>)
                ) : (
                    drivers.map((driver) => (
                        <div key={driver.id} className="card hover:border-primary-400 transition-all group">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">{driver.name}</h3>
                                        <p className="text-sm text-slate-500 font-medium">L# {driver.licenseNumber}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(driver.status)}`}>
                                    {driver.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                                        <Star size={14} className="text-amber-500 fill-amber-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-tight">Safety Score</span>
                                    </div>
                                    <p className="text-xl font-black text-slate-900">{driver.safetyScore}/10</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                                        <Truck size={14} className="text-primary-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-tight">Total Trips</span>
                                    </div>
                                    <p className="text-xl font-black text-slate-900">{driver.totalTrips}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Calendar size={14} />
                                        <span>Expiry: {new Date(driver.licenseExpiryDate).toLocaleDateString()}</span>
                                    </div>
                                    {(currentUser?.role === 'Fleet Manager' || currentUser?.role === 'Safety Officer') && (
                                        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                                            {driver.status === 'Off Duty' ? (
                                                <button
                                                    onClick={() => updateDriverStatus(driver.id, 'On Duty')}
                                                    className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold text-[10px] uppercase transition-colors"
                                                    title="Go On Duty"
                                                >
                                                    <Power size={14} />
                                                    Go On Duty
                                                </button>
                                            ) : driver.status === 'On Duty' ? (
                                                <button
                                                    onClick={() => updateDriverStatus(driver.id, 'Off Duty')}
                                                    className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold text-[10px] uppercase transition-colors"
                                                    title="Go Off Duty"
                                                >
                                                    <PowerOff size={14} />
                                                    Go Off Duty
                                                </button>
                                            ) : null}
                                        </div>
                                    )}
                                    {(currentUser?.role === 'Safety Officer') && (
                                        <button
                                            onClick={() => handleReportIncident(driver.id)}
                                            className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-bold text-[10px] uppercase transition-colors border-l border-slate-200 pl-4"
                                            title="Report Safety Incident"
                                        >
                                            <AlertCircle size={14} />
                                            Log Incident
                                        </button>
                                    )}
                                </div>
                                {driver.safetyScore >= 8 ? (
                                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                        <ShieldCheck size={14} />
                                        Elite
                                    </div>
                                ) : driver.safetyScore < 5 ? (
                                    <div className="flex items-center gap-1 text-rose-600 text-xs font-bold">
                                        <AlertCircle size={14} />
                                        Review
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Driver">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                        <input
                            required
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary-500"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">License Number</label>
                        <input
                            required
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary-500"
                            placeholder="DL-123456789"
                            value={formData.licenseNumber}
                            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">License Category</label>
                        <select
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary-500"
                            value={formData.licenseCategory}
                            onChange={(e) => setFormData({ ...formData, licenseCategory: e.target.value })}
                        >
                            <option value="Truck">Truck</option>
                            <option value="Van">Van</option>
                            <option value="Bike">Bike</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">License Expiry Date</label>
                        <input
                            type="date"
                            required
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary-500"
                            value={formData.licenseExpiryDate}
                            onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
                        />
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="btn btn-primary w-full py-4 text-lg">Register Driver</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DriversPage;

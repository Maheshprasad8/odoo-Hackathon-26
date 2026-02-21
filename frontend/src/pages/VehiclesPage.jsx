import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Truck, MapPin, Gauge, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Modal from '../components/Modal';

const VehiclesPage = () => {
    const { user: currentUser } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        licensePlate: '',
        model: '',
        type: 'Truck',
        maxLoadCapacity: '',
        odometer: '',
        region: '',
        acquisitionCost: ''
    });

    const fetchVehicles = async () => {
        try {
            const res = await api.get('/vehicles');
            setVehicles(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/vehicles', formData);
            toast.success('Asset registered successfully!');
            setIsModalOpen(false);
            fetchVehicles();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to register asset');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/vehicles/${id}`, { status });
            toast.success(`Asset status updated to ${status}`);
            fetchVehicles();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update asset status');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Available': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'On Trip': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'In Shop': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Retired': return 'bg-slate-100 text-slate-400 border-slate-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Fleet Registry</h1>
                    <p className="text-slate-500">Manage and monitor all physical assets.</p>
                </div>
                {currentUser?.role === 'Fleet Manager' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Register Asset
                    </button>
                )}
            </header>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by license plate or model..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="card !p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Asset</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Type</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Cost</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-slate-100 rounded-xl text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                            <Truck size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 uppercase">{vehicle.licensePlate}</p>
                                            <p className="text-xs text-slate-500">{vehicle.model}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center text-sm font-medium text-slate-600">{vehicle.type}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(vehicle.status)}`}>
                                        {vehicle.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-slate-900">
                                    ${vehicle.acquisitionCost?.toLocaleString() || 0}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {currentUser?.role === 'Fleet Manager' && (
                                            <>
                                                {vehicle.status !== 'Retired' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(vehicle.id, 'Retired')}
                                                        className="px-3 py-1 text-[10px] font-bold border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg uppercase"
                                                    >
                                                        Retire
                                                    </button>
                                                )}
                                                {vehicle.status === 'In Shop' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(vehicle.id, 'Available')}
                                                        className="px-3 py-1 text-[10px] font-bold border border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-lg uppercase"
                                                    >
                                                        Ready
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Physical Asset">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">License Plate</label>
                            <input required className="input-field" value={formData.licensePlate} onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })} placeholder="Unique ID" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Model Name</label>
                            <input required className="input-field" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} placeholder="e.g. Mercedes 1218" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                            <select className="input-field" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                <option value="Truck">Truck</option>
                                <option value="Van">Van</option>
                                <option value="Bike">Bike</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Max Load (kg)</label>
                            <input type="number" required className="input-field" value={formData.maxLoadCapacity} onChange={(e) => setFormData({ ...formData, maxLoadCapacity: e.target.value })} placeholder="5000" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Odometer (km)</label>
                            <input type="number" required className="input-field" value={formData.odometer} onChange={(e) => setFormData({ ...formData, odometer: e.target.value })} placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Acquisition Cost ($)</label>
                            <input type="number" required className="input-field" value={formData.acquisitionCost} onChange={(e) => setFormData({ ...formData, acquisitionCost: e.target.value })} placeholder="50000" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Operational Region</label>
                        <input required className="input-field" value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} placeholder="e.g. Central Fleet" />
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="btn btn-primary w-full py-4 text-lg font-bold">Register & Track Asset</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default VehiclesPage;

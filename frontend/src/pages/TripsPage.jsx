import React, { useEffect, useState } from 'react';
import { Plus, Search, MapPin, Truck, User, ArrowRight, Play, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Modal from '../components/Modal';

const TripsPage = () => {
    const { user: currentUser } = useAuth();
    const [trips, setTrips] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        vehicle: '',
        driver: '',
        cargoWeight: '',
        origin: '',
        destination: '',
        estimatedFuelCost: '',
        revenue: '',
    });

    const fetchAll = async () => {
        try {
            const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
                api.get('/trips'),
                api.get('/vehicles?status=Available'),
                api.get('/drivers')
            ]);
            setTrips(tripsRes.data);
            setVehicles(vehiclesRes.data);
            setDrivers(driversRes.data);
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
            await api.post('/trips', formData);
            toast.success('Trip plan created and saved as Draft');
            setIsModalOpen(false);
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create trip plan');
        }
    };

    const handleAction = async (id, action) => {
        try {
            let body = {};
            if (action === 'complete') {
                const odometer = prompt("Enter Final Odometer Reading (km):");
                if (!odometer) return;
                const fuel = prompt("Enter Actual Fuel Cost ($):");
                if (!fuel) return;
                body = {
                    finalOdometer: Number(odometer),
                    actualFuelCost: Number(fuel)
                };
            }
            await api.post(`/trips/${id}/${action}`, body);
            toast.success(`Trip status updated: ${action}`);
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${action} trip`);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Draft': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'Dispatched': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getDriverStatusStyle = (status) => {
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
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Trip Dispatcher</h1>
                    <p className="text-slate-500">Plan, dispatch and track cargo deliveries.</p>
                </div>
                {(currentUser?.role === 'Dispatcher' || currentUser?.role === 'Fleet Manager') && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary flex items-center gap-2 self-start"
                    >
                        <Plus size={20} />
                        New Trip Plan
                    </button>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>)
                ) : (
                    trips.map((trip) => (
                        <div key={trip.id} className="card flex flex-col hover:border-primary-400 transition-colors group relative overflow-hidden">
                            <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-xs font-bold border-b border-l ${getStatusStyle(trip.status)}`}>
                                {trip.status}
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-primary-100/50 text-primary-700 rounded-xl">
                                    <MapPin size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate flex items-center gap-2">
                                        {trip.origin} <ArrowRight size={14} /> {trip.destination}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium tracking-tight">Cargo: {trip.cargoWeight} kg</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 flex-1">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Truck size={16} className="text-slate-400" />
                                    <span className="font-medium underline decoration-primary-200 underline-offset-2 decoration-2">{trip.vehicle?.licensePlate || 'Vehicle Loading...'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <User size={16} className="text-slate-400" />
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{trip.driver?.name || 'Driver Loading...'}</span>
                                        {trip.driver?.status && (
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getDriverStatusStyle(trip.driver.status)}`}>
                                                {trip.driver.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Revenue</p>
                                    <p className="text-lg font-black text-slate-900">${trip.revenue?.toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    {(currentUser?.role === 'Dispatcher' || currentUser?.role === 'Fleet Manager') && (
                                        <>
                                            {trip.status === 'Draft' && (
                                                <button
                                                    onClick={() => handleAction(trip.id, 'dispatch')}
                                                    className="p-2.5 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center gap-2 px-4 shadow-sm"
                                                >
                                                    <Play size={16} fill="currentColor" />
                                                    <span className="text-xs font-bold">Dispatch</span>
                                                </button>
                                            )}
                                            {trip.status === 'Dispatched' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(trip.id, 'complete')}
                                                        className="p-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors"
                                                        title="Complete Trip"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(trip.id, 'cancel')}
                                                        className="p-2 bg-rose-100 text-rose-700 rounded-xl hover:bg-rose-200 transition-colors"
                                                        title="Cancel Trip"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Trip">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Select Vehicle</label>
                            <select
                                required
                                className="input-field"
                                value={formData.vehicle}
                                onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                            >
                                <option value="">Select...</option>
                                {vehicles.map(v => <option key={v.id} value={v.id}>{v.licensePlate} ({v.maxLoadCapacity}kg)</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Select Driver</label>
                            <select
                                required
                                className="input-field"
                                value={formData.driver}
                                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                            >
                                <option value="">Select...</option>
                                {drivers
                                    .filter(d => d.status === 'On Duty')
                                    .map(d => <option key={d.id} value={d.id}>{d.name} ({d.status})</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Cargo Weight (kg)</label>
                        <input
                            type="number"
                            required
                            className="input-field"
                            placeholder="Current cargo weight"
                            value={formData.cargoWeight}
                            onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Origin</label>
                            <input
                                required
                                className="input-field"
                                placeholder="Warehouse A"
                                value={formData.origin}
                                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Destination</label>
                            <input
                                required
                                className="input-field"
                                placeholder="Client Site B"
                                value={formData.destination}
                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Est. Fuel Cost</label>
                            <input
                                type="number"
                                required
                                className="input-field"
                                placeholder="250"
                                value={formData.estimatedFuelCost}
                                onChange={(e) => setFormData({ ...formData, estimatedFuelCost: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Revenue</label>
                            <input
                                type="number"
                                required
                                className="input-field"
                                placeholder="1200"
                                value={formData.revenue}
                                onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="btn btn-primary w-full py-4 text-lg">Save Trip Draft</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TripsPage;

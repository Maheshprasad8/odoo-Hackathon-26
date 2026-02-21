import React, { useEffect, useState } from 'react';
import { Activity, Truck, AlertTriangle, Package2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../api/api';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics/dashboard');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const KPIItems = [
        { label: 'Active Fleet', value: stats?.activeFleet || 0, icon: <Activity className="text-emerald-500" />, trend: '+12%', trendUp: true, subtext: 'Vehicles currently on trip' },
        { label: 'Maintenance Alerts', value: stats?.maintenanceAlerts || 0, icon: <AlertTriangle className="text-amber-500" />, trend: '-2', trendUp: false, subtext: 'Vehicles in shop' },
        { label: 'Pending Cargo', value: stats?.pendingCargo || 0, icon: <Package2 className="text-blue-500" />, trend: '+5', trendUp: true, subtext: 'Trips in draft status' },
        { label: 'Utilization Rate', value: `${stats?.utilizationRate || 0}%`, icon: <Truck className="text-primary-500" />, trend: '+2.4%', trendUp: true, subtext: 'Fleet capacity usage' },
    ];

    if (loading) return <div className="animate-pulse space-y-8">
        <div className="h-40 w-full bg-slate-200 rounded-2xl"></div>
        <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
        </div>
    </div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Command Center</h1>
                <p className="text-slate-500">Real-time fleet operations overview.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {KPIItems.map((item, idx) => (
                    <div key={idx} className="card hover:border-primary-500 hover:shadow-primary-600/10 group transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-primary-50 transition-colors">
                                {item.icon}
                            </div>
                            <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${item.trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                                {item.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {item.trend}
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">{item.value}</h3>
                        <p className="text-sm font-semibold text-slate-500 mb-1">{item.label}</p>
                        <p className="text-xs text-slate-400">{item.subtext}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card">
                    <h3 className="text-lg font-bold mb-6">Fleet Utilization Trend</h3>
                    <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-400 font-medium italic">Chart loading aggregation data... [Recharts placeholder]</p>
                    </div>
                </div>
                <div className="card">
                    <h3 className="text-lg font-bold mb-6">Vehicle Status Breakdown</h3>
                    <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-400 font-medium italic">Status Pie Chart Placeholder</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, DollarSign, Wallet, Percent, ArrowUpRight, AlertTriangle, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const AnalyticsPage = () => {
    const { user: currentUser } = useAuth();
    const [summary, setSummary] = useState(null);
    const [performance, setPerformance] = useState([]);
    const [deadStock, setDeadStock] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const [summaryRes, perfRes] = await Promise.all([
                api.get('/analytics/financials'),
                api.get('/analytics/asset-performance')
            ]);
            setSummary(summaryRes.data);
            setPerformance(perfRes.data);

            // Conditional fetch for dead stock (Fleet Manager only)
            if (currentUser?.role === 'Fleet Manager') {
                const deadStockRes = await api.get('/analytics/dead-stock');
                setDeadStock(deadStockRes.data);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load some analytics data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const chartData = [
        { name: 'Revenue', value: summary?.revenue || 0, color: '#0ea5e9' },
        { name: 'Expenses', value: (summary?.fuelCost || 0) + (summary?.maintenanceCost || 0), color: '#f43f5e' },
    ];

    const expenseBreakdown = [
        { name: 'Fuel', value: summary?.fuelCost || 0 },
        { name: 'Maintenance', value: summary?.maintenanceCost || 0 },
    ];

    const COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#6366f1'];

    const handleExport = () => {
        const headers = ['Metric', 'Value'];
        const data = [
            ['Total Revenue', summary?.revenue],
            ['Net Profit', summary?.netProfit],
            ['Fleet ROI', `${summary?.roi}%`],
            ['Dead Stock', `${deadStock.length} Vehicles`]
        ];

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + data.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "fleet_analytics_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-4 gap-6"><div className="h-32 bg-slate-200 rounded-xl" colSpan="4"></div></div>
        <div className="h-[400px] bg-slate-200 rounded-2xl"></div>
    </div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Operational Analytics</h1>
                    <p className="text-slate-500">Fleet ROI and financial performance insights.</p>
                </div>
                <button
                    onClick={handleExport}
                    className="btn btn-secondary flex items-center gap-2"
                >
                    <Download size={18} />
                    Export Report (CSV)
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><DollarSign size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Revenue</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">${summary?.revenue.toLocaleString()}</p>
                </div>
                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Wallet size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Profit</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">${summary?.netProfit.toLocaleString()}</p>
                </div>
                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Percent size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fleet ROI</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-2xl font-black text-slate-900">{summary?.roi}%</p>
                        <span className="text-emerald-500 flex items-center text-xs font-bold mb-1"><ArrowUpRight size={14} /> Global Avg</span>
                    </div>
                </div>
                <div className="card border-rose-100 bg-rose-50/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><AlertTriangle size={20} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-rose-600">Dead Stock</span>
                    </div>
                    <p className="text-2xl font-black text-rose-700">{deadStock.length} Vehicles</p>
                    <p className="text-[10px] text-rose-400 font-bold mt-1 uppercase">Idle for 30+ days</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                    <h3 className="text-lg font-bold mb-8">Revenue vs Total Expenses</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-bold mb-8">Expense Distribution</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {expenseBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(val) => [`$${val.toLocaleString()}`, 'Amount']}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card !p-0 overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-bold text-slate-900">Asset-Specific Performance</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Efficiency (km/L)</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Asset ROI</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Health Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {performance.map((asset) => (
                            <tr key={asset.licensePlate} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-bold text-slate-900">{asset.licensePlate}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-sm font-medium">{asset.kmPerLiter.toFixed(2)} km/L</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`text-sm font-bold ${asset.roi > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {(asset.roi * 100).toFixed(1)}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${asset.kmPerLiter > 5 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                        <span className="text-xs font-medium text-slate-500">
                                            {asset.kmPerLiter > 5 ? 'Optimal' : 'Needs Audit'}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {deadStock.length > 0 && (
                <div className="card border-rose-200">
                    <h3 className="text-lg font-bold text-rose-700 mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} />
                        Critical: Dead Stock Report
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {deadStock.map(v => (
                            <div key={v.id} className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                                <p className="font-bold text-slate-900">{v.licensePlate}</p>
                                <p className="text-xs text-rose-500 font-medium">Idle since: {new Date(v.lastTripDate).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsPage;

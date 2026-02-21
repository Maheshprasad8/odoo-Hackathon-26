import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Activity, MapPin, Package, AlertTriangle, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const AnimatedProductDemo = () => {
    const [step, setStep] = useState(0);
    const totalSteps = 4;

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % totalSteps);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const demoSteps = [
        {
            title: "Real-time Monitoring",
            description: "Track your entire fleet's live location and status.",
            icon: <Activity className="text-primary-500" />,
            component: <LiveTrackingView />
        },
        {
            title: "Smart Dispatching",
            description: "Assign trips and optimize routes instantly.",
            icon: <Truck className="text-blue-500" />,
            component: <DispatchingView />
        },
        {
            title: "Expense Analytics",
            description: "Monitor fuel and maintenance costs in real-time.",
            icon: <ArrowUpRight className="text-emerald-500" />,
            component: <AnalyticsView />
        },
        {
            title: "Fleet Safety",
            description: "Receive instant alerts for maintenance or safety issues.",
            icon: <AlertTriangle className="text-amber-500" />,
            component: <SafetyView />
        }
    ];

    return (
        <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col lg:flex-row">
            {/* Sidebar Controls */}
            <div className="w-full lg:w-64 bg-slate-950/50 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="ml-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Live Demo</span>
                </div>
                {demoSteps.map((s, idx) => (
                    <button
                        key={idx}
                        onClick={() => setStep(idx)}
                        className={`flex flex-col p-4 rounded-xl transition-all text-left ${step === idx ? 'bg-primary-600/10 border border-primary-600/50' : 'hover:bg-slate-800/50 border border-transparent'}`}
                    >
                        <div className="flex items-center gap-3 mb-1">
                            {s.icon}
                            <span className={`font-bold text-xs ${step === idx ? 'text-white' : 'text-slate-400'}`}>{s.title}</span>
                        </div>
                        <div className={`text-[10px] leading-tight ${step === idx ? 'text-slate-300' : 'text-slate-500'}`}>
                            {s.description}
                        </div>
                        {step === idx && (
                            <motion.div
                                layoutId="progress"
                                className="h-0.5 bg-primary-500 mt-3 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 5, ease: "linear" }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Main Demo Area */}
            <div className="flex-1 bg-slate-900 p-8 relative overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full"
                    >
                        {demoSteps[step].component}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// Sub-components for Demo Views
const LiveTrackingView = () => (
    <div className="w-full h-full flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Active Vehicles</p>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white leading-none">124</span>
                    <span className="text-[10px] text-emerald-500 font-bold">+12%</span>
                </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total Distance</p>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white leading-none">8.2k</span>
                    <span className="text-[10px] text-slate-500">mi</span>
                </div>
            </div>
        </div>
        <div className="flex-1 bg-slate-800 rounded-2xl border border-slate-700 relative overflow-hidden group">
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20px_20px,#334155_1px,transparent_0)] bg-[size:40px_40px]"></div>

            {/* Animated Vehicles on Map */}
            <motion.div
                animate={{ x: [0, 100, 50, 0], y: [0, 50, 100, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 left-1/4"
            >
                <div className="relative group/truck">
                    <div className="bg-primary-500 p-2 rounded-lg shadow-2xl animate-pulse">
                        <Truck className="text-white" size={16} />
                    </div>
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-950 text-[8px] text-white px-2 py-1 rounded border border-slate-800 whitespace-nowrap opacity-0 group-hover/truck:opacity-100 transition-opacity">
                        ID: FL-202 | Stable
                    </div>
                </div>
            </motion.div>

            <motion.div
                animate={{ x: [200, 50, 150, 200], y: [150, 200, 50, 150] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0"
            >
                <div className="bg-emerald-500 p-2 rounded-lg shadow-2xl">
                    <Truck className="text-white" size={16} />
                </div>
            </motion.div>

            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <MapPin size={14} className="text-slate-400" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-bold leading-tight">Current Fleet Spread</p>
                        <p className="text-xs text-white font-medium">North America Region</p>
                    </div>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 text-[8px] font-bold px-2 py-1 rounded-full uppercase">All Active</div>
            </div>
        </div>
    </div>
);

const DispatchingView = () => (
    <div className="w-full h-full flex flex-col gap-4">
        <h4 className="text-white font-bold text-sm">Assign New Trip</h4>
        <div className="space-y-3">
            {[
                { label: "Cargo Type", value: "Electronics", icon: <Package size={14} /> },
                { label: "Destination", value: "Chicago Hub (W-4)", icon: <MapPin size={14} /> },
                { label: "Vehicle", value: "Volvo VNL (FL-301)", icon: <Truck size={14} /> }
            ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-800 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-3 text-slate-400">
                        {item.icon}
                        <span className="text-xs font-medium">{item.label}</span>
                    </div>
                    <span className="text-xs text-white font-bold">{item.value}</span>
                </div>
            ))}
        </div>
        <div className="mt-auto bg-primary-600 p-4 rounded-xl text-center shadow-lg shadow-primary-600/20">
            <span className="text-xs font-bold text-white">Optimize & Deploy</span>
        </div>
        <div className="mt-4 p-4 border border-dashed border-slate-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-[10px] text-slate-400">AI Route Optimization complete</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    className="h-full bg-emerald-500"
                />
            </div>
        </div>
    </div>
);

const AnalyticsView = () => (
    <div className="w-full h-full flex flex-col gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-full flex flex-col">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h4 className="text-white font-bold">Cost Overview</h4>
                    <p className="text-xs text-slate-500">Fuel & Maintenance Tracking</p>
                </div>
                <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 text-[10px] text-slate-400 font-bold">
                    THIS MONTH
                </div>
            </div>

            <div className="flex-1 flex items-end gap-2">
                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.1 }}
                        className="flex-1 bg-gradient-to-t from-primary-600 to-indigo-500 rounded-t-lg opacity-40 hover:opacity-100 transition-opacity"
                    />
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-700/50">
                <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Fuel</p>
                    <p className="text-xl font-bold text-white">$12,450</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Efficiency</p>
                    <p className="text-xl font-bold text-emerald-500">94.2%</p>
                </div>
            </div>
        </div>
    </div>
);

const SafetyView = () => (
    <div className="w-full h-full flex flex-col gap-4">
        <div className="bg-amber-500/10 border border-amber-500/50 p-4 rounded-xl flex items-start gap-4">
            <div className="p-2 bg-amber-500 rounded-lg shrink-0">
                <AlertTriangle className="text-white" size={18} />
            </div>
            <div>
                <h4 className="text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">Urgent Alert</h4>
                <p className="text-xs text-white font-medium mb-1">Vehicle FL-204: Brake System Warning</p>
                <p className="text-[10px] text-slate-400">Scheduled maintenance required within 50 miles.</p>
            </div>
        </div>

        <div className="flex-1 space-y-3 mt-4">
            <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Recent Fleet Incidents</h5>
            {[
                { user: "Driver 41", action: "Sudden Braking detected", time: "2 min ago", color: "text-rose-500" },
                { user: "Vehicle FL-102", action: "Overspeeding 10mph+", time: "15 min ago", color: "text-rose-500" },
                { user: "Driver 12", action: "Compliance rest period", time: "1 hr ago", color: "text-emerald-500" }
            ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-800">
                    <div className="flex flex-col">
                        <span className="text-xs text-white font-medium">{item.user}</span>
                        <span className="text-[10px] text-slate-500">{item.action}</span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-bold">{item.time}</span>
                </div>
            ))}
        </div>
    </div>
);

export default AnimatedProductDemo;

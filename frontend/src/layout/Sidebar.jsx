import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Truck,
    Users,
    MapPin,
    BarChart3,
    CreditCard,
    Wrench,
    ShieldAlert,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
        { name: 'Fleet Registry', path: '/vehicles', icon: <Truck size={20} />, roles: ['Fleet Manager'] },
        { name: 'Trip Dispatcher', path: '/trips', icon: <MapPin size={20} />, roles: ['Fleet Manager', 'Dispatcher'] },
        { name: 'Drivers', path: '/drivers', icon: <Users size={20} />, roles: ['Fleet Manager', 'Safety Officer'] },
        { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} />, roles: ['Fleet Manager', 'Financial Analyst'] },
        { name: 'Maintenance', path: '/maintenance', icon: <Wrench size={20} />, roles: ['Fleet Manager'] },
        { name: 'Expenses', path: '/expenses', icon: <CreditCard size={20} />, roles: ['Fleet Manager', 'Financial Analyst'] },
        { name: 'Safety', path: '/safety', icon: <ShieldAlert size={20} />, roles: ['Fleet Manager', 'Safety Officer'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <aside className="w-64 bg-sidebar text-slate-300 h-screen fixed left-0 top-0 flex flex-col z-50 shadow-xl transition-all duration-300">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-primary-500 p-2 rounded-lg">
                    <Truck className="text-white" size={24} />
                </div>
                <h1 className="text-xl font-black text-white tracking-tight">FleetFlow</h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                {filteredItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'hover:bg-slate-800 hover:text-white'}
                        `}
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-700">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border-2 border-primary-400">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

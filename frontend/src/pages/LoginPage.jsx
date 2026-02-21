import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Truck, Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            toast.success('Welcome back to FleetFlow!');
            navigate('/app/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || err || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            <LandingNavbar />

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-indigo-200 blur-[100px] rounded-full"></div>
            </div>

            <div className="min-h-screen pt-32 pb-12 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center justify-center p-4 bg-primary-600 rounded-2xl shadow-xl shadow-primary-500/20 mb-6"
                        >
                            <Truck className="text-white w-8 h-8" />
                        </motion.div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-slate-500">Sign in to manage your fleet operations.</p>
                    </div>

                    <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-premium relative z-10">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm"
                            >
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="input-field pl-12"
                                        placeholder="admin@fleetflow.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-sm font-bold text-slate-700">Password</label>
                                    <Link to="#" className="text-xs font-semibold text-primary-600 hover:text-primary-500">Forgot password?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        required
                                        className="input-field pl-12"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full py-4 text-lg mt-2 group"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center mt-8">
                            <p className="text-slate-500 text-sm">
                                New to FleetFlow?{' '}
                                <Link to="/register" className="text-primary-600 font-bold hover:text-primary-500 hover:underline underline-offset-4 transition-all">
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="text-center mt-10 text-slate-400 text-xs">
                        &copy; {new Date().getFullYear()} FleetFlow Inc. Secure Enterprise Access.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;

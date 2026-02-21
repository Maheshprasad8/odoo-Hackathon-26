import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Shield, BarChart3, Clock, ArrowRight, CheckCircle2, MapPin, Users, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import LandingFooter from '../components/LandingFooter';
import AnimatedProductDemo from '../components/AnimatedProductDemo';

const LandingPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const stagger = {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
        transition: { staggerChildren: 0.2 }
    };

    const features = [
        {
            icon: <Truck className="text-primary-600" size={32} />,
            title: "Fleet Tracking",
            description: "Real-time monitoring of your entire fleet with GPS integration and status updates."
        },
        {
            icon: <Shield className="text-primary-600" size={32} />,
            title: "Safety & Compliance",
            description: "Advanced safety metrics and driver behavior analysis to ensure industry compliance."
        },
        {
            icon: <BarChart3 className="text-primary-600" size={32} />,
            title: "Detailed Analytics",
            description: "Comprehensive reports on fuel efficiency, trip costs, and fleet utilization."
        },
        {
            icon: <Clock className="text-primary-600" size={32} />,
            title: "Predictive Maintenance",
            description: "Stay ahead of repairs with automated alerts based on vehicle mileage and health data."
        }
    ];

    const stats = [
        { label: "Active Fleets", value: "500+" },
        { label: "Miles Tracked", value: "10M+" },
        { label: "Cost Savings", value: "25%" },
        { label: "On-time Delivery", value: "99.9%" }
    ];

    return (
        <div className="bg-white">
            <LandingNavbar />

            {/* Hero Section */}
            <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-indigo-200 blur-[100px] rounded-full"></div>
                </div>

                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-bold mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                        Next-Gen Fleet Management
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8"
                    >
                        Streamline Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Logistics Workflow</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Optimize routes, manage fuel costs, and track your fleet in real-time with FleetFlow's intelligent management dashboard.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
                            Start Free Trial
                            <ArrowRight className="ml-2" size={20} />
                        </Link>
                        <Link to="/login" className="btn btn-secondary text-lg px-8 py-4">
                            Live Demo
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="mt-20 relative max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white shadow-indigo-500/20"
                    >
                        <div className="aspect-video bg-slate-900">
                            <AnimatedProductDemo />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <motion.h2 {...fadeIn} className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                            Everything You Need to Manage Your Fleet
                        </motion.h2>
                        <motion.p {...fadeIn} className="text-slate-600 text-lg">
                            Powerful tools designed to help fleet managers, dispatchers, and drivers work together seamlessly.
                        </motion.p>
                    </div>

                    <motion.div
                        variants={stagger}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeIn}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-primary-300 hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="p-4 bg-slate-50 rounded-2xl w-fit mb-6 group-hover:bg-primary-50 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-slate-600 line-height-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Project Overview / Animation Section */}
            <section id="solution" className="py-24 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 space-y-8"
                        >
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                                How FleetFlow <br />
                                <span className="text-primary-600 underline decoration-indigo-200 underline-offset-8">Transforms Operations</span>
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                FleetFlow isn't just a tracking tool; it's a comprehensive platform that connects every part of your logistics chain. From the moment a shipment is assigned to its final delivery, we provide visibility and control.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { title: "Centralized Management", desc: "Manage drivers, vehicles, and trips from one unified hub." },
                                    { title: "Instant Freight Notifications", desc: "Real-time alerts for delays, breakdowns, or route changes." },
                                    { title: "Dynamic Cost Control", desc: "Keep track of every penny spent on fuel, tolls, and maintenance." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                                        <div className="shrink-0 mt-1">
                                            <CheckCircle2 className="text-emerald-500" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{item.title}</h4>
                                            <p className="text-slate-500 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 relative"
                        >
                            {/* Simple Visual Animation Mockup */}
                            <div className="relative aspect-square max-w-md mx-auto">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border-2 border-dashed border-slate-200"
                                ></motion.div>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-primary-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-600/40 z-10">
                                        <Truck className="text-white" size={40} />
                                    </div>
                                </div>

                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
                                >
                                    <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Destination</p>
                                            <p className="text-xs font-bold text-slate-800">Warehouse B-12</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ x: [0, 20, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute right-0 top-1/2 -translate-y-1/2"
                                >
                                    <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Users size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Driver</p>
                                            <p className="text-xs font-bold text-slate-800">John Cooper</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ x: [0, -20, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute left-0 bottom-20"
                                >
                                    <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                            <Package size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Cargo</p>
                                            <p className="text-xs font-bold text-slate-800">Fragile Goods</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-primary-600 rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                        <h2 className="text-4xl lg:text-5xl font-bold mb-8 relative z-10">
                            Ready to Optimize Your Fleet?
                        </h2>
                        <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto relative z-10">
                            Join over 500+ companies that use FleetFlow to reduce costs and improve their logistics performance every day.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                            <Link to="/register" className="bg-white text-primary-600 hover:bg-slate-50 px-10 py-4 rounded-xl font-bold transition-all shadow-xl shadow-primary-900/20">
                                Get Started Free
                            </Link>
                            <button className="border-2 border-primary-400 text-white hover:bg-primary-500 px-10 py-4 rounded-xl font-bold transition-all">
                                Contact Sales
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default LandingPage;

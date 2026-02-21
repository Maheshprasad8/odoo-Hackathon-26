import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const LandingFooter = () => {
    return (
        <footer id="footer" className="bg-slate-900 text-slate-300 py-16">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <div className="p-2 bg-primary-600 rounded-lg">
                                <Truck className="text-white" size={24} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">FleetFlow</span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6">
                            Simplifying logistics with intelligent fleet management and real-time tracking. Modern solutions for modern fleets.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-primary-400 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-primary-400 transition-colors"><Linkedin size={20} /></a>
                            <a href="#" className="hover:text-primary-400 transition-colors"><Github size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#tracking" className="hover:text-white transition-colors">Fleet Tracking</a></li>
                            <li><a href="#analytics" className="hover:text-white transition-colors">Analytics</a></li>
                            <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                            <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Stay Updated</h4>
                        <p className="text-sm mb-4">Subscribe for the latest in fleet optimization.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-slate-800 border-none rounded-lg p-3 text-sm flex-1 focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                            <button className="bg-primary-600 hover:bg-primary-500 p-3 rounded-lg transition-colors">
                                <Mail size={18} className="text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p>&copy; {new Date().getFullYear()} FleetFlow Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;

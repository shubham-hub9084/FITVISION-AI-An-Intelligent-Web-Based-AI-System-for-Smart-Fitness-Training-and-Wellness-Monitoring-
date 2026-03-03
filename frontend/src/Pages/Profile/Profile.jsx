import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../../components/BackButton';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        weight: 'Not set',
        height: 'Not set',
        goal: 'Not set'
    });
    useEffect(() => {
        AOS.init({ duration: 800 });

        // Prefer data from Database (User Context)
        if (user) {
            setStats({
                weight: user.weight ? `${user.weight} kg` : 'Not set',
                height: user.height ? `${user.height} cm` : 'Not set',
                goal: user.goal ? user.goal.replace('-', ' ') : 'Not set'
            });
        }
        // Fallback: Try to fetch stats from localStorage (if MealPlan saved them but not synced yet)
        else {
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                try {
                    const parsed = JSON.parse(savedProfile);
                    setStats({
                        weight: parsed.weight ? `${parsed.weight} kg` : 'Not set',
                        height: parsed.height ? `${parsed.height} cm` : 'Not set',
                        goal: parsed.goal ? parsed.goal.replace('-', ' ') : 'Not set'
                    });
                } catch (e) {
                    console.error("Error reading profile stats", e);
                }
            }
        }
    }, [user]);

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-12 transition-colors duration-300 font-sans">
            {/* Hero Section with Rich Gradient */}
            <div className="relative h-72 sm:h-80 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 overflow-hidden">
                {/* Abstract Shapes for Texture */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl mix-blend-overlay"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-teal-300 blur-2xl mix-blend-overlay"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-cyan-200 blur-3xl mix-blend-overlay"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
                    <BackButton className="text-white hover:bg-white/20 border-white/30 backdrop-blur-sm transition-all" />
                </div>
            </div>

            {/* Main Content Container - Overlapping Hero */}
            <div className="relative -mt-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto" data-aos="fade-up">
                {/* Glassmorphic Card */}
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50 transition-colors duration-300">

                    {/* Header / Avatar Section */}
                    <div className="relative pt-16 pb-8 text-center px-6">
                        {/* Floating Avatar */}
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full p-1 bg-white dark:bg-slate-700 shadow-xl ring-4 ring-white/50 dark:ring-slate-700/50 ring-offset-2 ring-offset-emerald-600 transition-colors overflow-hidden">
                                    {user?.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt={user.full_name || "Profile"}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900 dark:to-teal-800 flex items-center justify-center text-4xl font-bold text-emerald-700 dark:text-emerald-300 select-none">
                                            {getInitials(user?.full_name)}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-1 right-1 w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-emerald-700 transition-all transform hover:scale-105" title="Upload Photo">
                                    <i className="ri-camera-fill text-sm"></i>
                                </div>
                            </div>
                        </div>

                        {/* User Identity */}
                        <div className="mt-2">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight transition-colors">{user?.full_name || 'User Name'}</h1>
                            <p className="text-emerald-600 dark:text-emerald-400 font-medium mt-1">Fitness Enthusiast</p>
                            <div className="flex items-center justify-center gap-2 mt-3 text-gray-500 dark:text-gray-400 text-sm">
                                <i className="ri-mail-line"></i>
                                <span>{user?.email || 'email@example.com'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-6 sm:px-10 sm:py-10 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-slate-900/50 rounded-b-3xl transition-colors duration-300">
                        {/* Stats Widgets */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
                            {/* Goal Widget */}
                            <div className="bg-white dark:bg-slate-700 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-600 flex flex-col items-center hover:shadow-md transition-all group">
                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <i className="ri-flag-line text-blue-600 dark:text-blue-400 text-xl"></i>
                                </div>
                                <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-1">Current Goal</p>
                                <p className="font-bold text-gray-800 dark:text-white text-lg capitalize">{stats.goal}</p>
                            </div>

                            {/* Weight Widget */}
                            <div className="bg-white dark:bg-slate-700 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-600 flex flex-col items-center hover:shadow-md transition-all group">
                                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <i className="ri-scales-3-line text-orange-600 dark:text-orange-400 text-xl"></i>
                                </div>
                                <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-1">Weight</p>
                                <p className="font-bold text-gray-800 dark:text-white text-lg">{stats.weight}</p>
                            </div>

                            {/* Height Widget */}
                            <div className="bg-white dark:bg-slate-700 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-600 flex flex-col items-center hover:shadow-md transition-all group">
                                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <i className="ri-ruler-line text-purple-600 dark:text-purple-400 text-xl"></i>
                                </div>
                                <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-1">Height</p>
                                <p className="font-bold text-gray-800 dark:text-white text-lg">{stats.height}</p>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="border-t border-gray-100 dark:border-slate-700 pt-8 transition-colors">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Account Details</h3>
                                <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium flex items-center gap-1 hover:underline">
                                    Edit Information <i className="ri-arrow-right-s-line"></i>
                                </button>
                            </div>

                            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-2xl p-5 border border-gray-100 dark:border-slate-600 space-y-4 transition-colors">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-gray-200/50 dark:border-slate-600/50 last:border-0">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</span>
                                    <span className="text-gray-900 dark:text-white font-semibold">{user?.username || 'user123'}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-gray-200/50 dark:border-slate-600/50 last:border-0">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</span>
                                    <span className="text-gray-900 dark:text-white font-semibold">{user?.email}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-gray-200/50 dark:border-slate-600/50 last:border-0">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</span>
                                    <span className="text-gray-900 dark:text-white font-semibold">December 2024</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-10 flex gap-4">
                            <button
                                onClick={logout}
                                className="w-full py-3.5 px-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                            >
                                <i className="ri-logout-box-r-line group-hover:rotate-180 transition-transform duration-500"></i>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-8">FitVision AI Service &copy; 2025</p>
            </div>
        </div>
    );
};


export default Profile;

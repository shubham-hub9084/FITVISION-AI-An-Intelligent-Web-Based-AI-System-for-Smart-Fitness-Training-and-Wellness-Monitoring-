import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../../components/BackButton';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
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
                    <BackButton className="!text-black dark:!text-white hover:bg-black/10 dark:hover:bg-white/20 border-black/30 dark:border-white/30 backdrop-blur-sm transition-all" />
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
                        {/* Tabs Navigation */}
                        <div className="flex border-b border-gray-200 dark:border-slate-700 mb-8 overflow-x-auto hide-scrollbar">
                            <button 
                                onClick={() => setActiveTab('overview')}
                                className={`whitespace-nowrap py-3 px-6 text-sm font-semibold border-b-2 transition-all duration-300 ${activeTab === 'overview' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                            >
                                <i className="ri-dashboard-line mr-2"></i>Overview
                            </button>
                            <button 
                                onClick={() => setActiveTab('settings')}
                                className={`whitespace-nowrap py-3 px-6 text-sm font-semibold border-b-2 transition-all duration-300 ${activeTab === 'settings' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                            >
                                <i className="ri-settings-3-line mr-2"></i>Settings
                            </button>
                            <button 
                                onClick={() => setActiveTab('preferences')}
                                className={`whitespace-nowrap py-3 px-6 text-sm font-semibold border-b-2 transition-all duration-300 ${activeTab === 'preferences' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                            >
                                <i className="ri-sound-module-line mr-2"></i>Preferences
                            </button>
                        </div>

                        {/* Tab Content: Overview */}
                        {activeTab === 'overview' && (
                            <div className="space-y-8 transition-all duration-500">
                                {/* Stats Widgets */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    <div className="bg-white dark:bg-slate-700 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-600 flex flex-col items-center hover:shadow-md transition-all group hover:-translate-y-1">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                                            <i className="ri-flag-fill text-blue-600 dark:text-blue-400 text-2xl"></i>
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest mb-1">Current Goal</p>
                                        <p className="font-extrabold text-gray-800 dark:text-white text-lg capitalize">{stats.goal}</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-700 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-600 flex flex-col items-center hover:shadow-md transition-all group hover:-translate-y-1">
                                        <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                                            <i className="ri-scales-3-fill text-orange-600 dark:text-orange-400 text-2xl"></i>
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest mb-1">Weight</p>
                                        <p className="font-extrabold text-gray-800 dark:text-white text-lg">{stats.weight}</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-700 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-600 flex flex-col items-center hover:shadow-md transition-all group hover:-translate-y-1">
                                        <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                                            <i className="ri-ruler-fill text-purple-600 dark:text-purple-400 text-2xl"></i>
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest mb-1">Height</p>
                                        <p className="font-extrabold text-gray-800 dark:text-white text-lg">{stats.height}</p>
                                    </div>
                                </div>

                                {/* Account Details */}
                                <div className="border-t border-gray-100 dark:border-slate-700 pt-8 transition-colors">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                            <i className="ri-user-settings-line text-emerald-500"></i> Account Details
                                        </h3>
                                        <button onClick={() => setActiveTab('settings')} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium flex items-center gap-1 hover:underline">
                                            Edit <i className="ri-arrow-right-s-line"></i>
                                        </button>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-600 space-y-5 transition-colors shadow-inner">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-gray-200/50 dark:border-slate-600/50 last:border-0">
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</span>
                                            <span className="text-gray-900 dark:text-white font-bold">{user?.username || 'user123'}</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-gray-200/50 dark:border-slate-600/50 last:border-0">
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</span>
                                            <span className="text-gray-900 dark:text-white font-bold">{user?.email || 'email@example.com'}</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-gray-200/50 dark:border-slate-600/50 last:border-0">
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</span>
                                            <span className="text-gray-900 dark:text-white font-bold">
                                                {user?.clerkUser?.createdAt ? new Date(user.clerkUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Settings */}
                        {activeTab === 'settings' && (
                            <div className="space-y-6 transition-all duration-500">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Edit Profile</h3>
                                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Full Name</label>
                                            <input type="text" defaultValue={user?.full_name} className="w-full bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none" placeholder="Enter your name" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Username</label>
                                            <input type="text" defaultValue={user?.username} className="w-full bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none" placeholder="Enter username" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                            Email Address <span className="text-emerald-600 dark:text-emerald-400 text-xs ml-2 font-bold">(Verified)</span>
                                        </label>
                                        <input type="email" defaultValue={user?.email} disabled readOnly className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none select-none" placeholder="Enter email" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Weight (kg)</label>
                                            <input type="number" defaultValue={user?.weight} className="w-full bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none" placeholder="Enter weight" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Height (cm)</label>
                                            <input type="number" defaultValue={user?.height} className="w-full bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none" placeholder="Enter height" />
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end gap-3">
                                        <button type="button" onClick={() => setActiveTab('overview')} className="px-6 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                                        <button type="button" className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Tab Content: Preferences */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-6 transition-all duration-500">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Notification Preferences</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-2xl border border-gray-100 dark:border-slate-600 shadow-sm transition-all hover:shadow-md">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white">Workout Reminders</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts for your scheduled workouts</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-2xl border border-gray-100 dark:border-slate-600 shadow-sm transition-all hover:shadow-md">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white">Weekly Progress Report</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Get a summary of your achievements via email</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-2xl border border-gray-100 dark:border-slate-600 shadow-sm transition-all hover:shadow-md">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white">Marketing Emails</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Receive news, special offers, and updates</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sign Out Button */}
                        <div className="pt-8 mt-8 border-t border-gray-100 dark:border-slate-700">
                            <button
                                onClick={logout}
                                className="w-full relative overflow-hidden bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
                            >
                                <i className="ri-logout-box-r-line group-hover:rotate-180 transition-transform duration-500"></i>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-8">FitVision AI Service &copy; {new Date().getFullYear()}</p>
            </div>
        </div>
    );
};


export default Profile;

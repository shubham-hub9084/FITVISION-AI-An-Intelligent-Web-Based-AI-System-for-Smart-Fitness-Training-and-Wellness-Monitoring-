import React, { useState, useEffect } from 'react';
import config from '../../config';
import BackButton from '../../components/BackButton';
import CameraWorkout from './CameraWorkout';
import Overview from './Overview/Overview';
import Progress from './Progress/Progress';
import Achievements from './Achievements/Achievements';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';
import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {
    const [showCameraWorkout, setShowCameraWorkout] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const { user } = useAuth();

    // Real data fetching
    const [achievements, setAchievements] = useState([]);
    const [currentData, setCurrentData] = useState({
        workouts: 0,
        totalTime: 0,
        caloriesBurned: 0,
        totalErrors: 0,
        todayErrors: 0,
        improvements: [],
        errorsByWorkout: {}
    });

    const loadDashboardData = async () => {
        if (!user?.id) return;
        try {
            const response = await fetch(`${config.API_BASE_URL}/api/progress?user_id=${user.id}`);
            const data = await response.json();

            if (data.total_stats) {
                setCurrentData({
                    workouts: data.total_stats.total_workouts || 0,
                    totalTime: Math.round((data.total_stats.total_duration || 0) / 60),
                    caloriesBurned: Math.round((data.total_stats.total_reps || 0) * 0.5),
                    totalErrors: data.total_errors || 0,
                    todayErrors: data.today_errors || 0,
                    improvements: data.improvements || [],
                    errorsByWorkout: data.errors_by_workout || {},
                    streaks: data.streaks || { current: 0, longest: 0 }
                });
            }
            if (data.achievements) {
                setAchievements(data.achievements);
            }
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
        }
    };

    useEffect(() => {
        if (user?.id) {
            loadDashboardData();
        }
    }, [user?.id]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            {showCameraWorkout && (
                <CameraWorkout
                    user_id={user?.id}
                    onClose={() => setShowCameraWorkout(false)}
                    onWorkoutComplete={loadDashboardData}
                />
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
            >
                <BackButton />
                {/* Header */}
                <div className="mb-6 sm:mb-8 mt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Welcome back, {user?.full_name || 'User'}!
                            </h1>
                            <div className="flex items-center gap-2">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Here's your fitness progress and personalized recommendations.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0 flex gap-3">
                            <button
                                onClick={() => setShowCameraWorkout(true)}
                                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 whitespace-nowrap cursor-pointer flex items-center gap-2"
                            >
                                <i className="ri-camera-line text-lg group-hover:scale-110 transition-transform"></i>
                                Start AI Workout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6 sm:mb-8">
                    <div className="border-b border-gray-200 dark:border-slate-700">
                        <nav className="-mb-px flex space-x-8 overflow-x-auto">
                            {[
                                {
                                    id: "overview",
                                    label: "Overview",
                                    icon: "ri-dashboard-line",
                                },
                                {
                                    id: "progress",
                                    label: "Progress",
                                    icon: "ri-bar-chart-line",
                                },
                                {
                                    id: "achievements",
                                    label: "Achievements",
                                    icon: "ri-trophy-line",
                                }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${activeTab === tab.id
                                        ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-slate-600"
                                        }`}
                                >
                                    <i className={`${tab.icon} text-lg`}></i>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {activeTab === "overview" && (
                    <Overview
                        currentData={currentData}
                        setShowCameraWorkout={setShowCameraWorkout}
                        achievements={achievements}
                    />
                )}

                {activeTab === "progress" && (
                    <Progress
                        currentData={currentData}
                        user_id={user?.id}
                    />
                )}

                {activeTab === "achievements" && (
                    <Achievements 
                        achievements={achievements} 
                        streaks={currentData.streaks} 
                    />
                )}
            </motion.div>
        </div>
    );
};

export default UserDashboard;

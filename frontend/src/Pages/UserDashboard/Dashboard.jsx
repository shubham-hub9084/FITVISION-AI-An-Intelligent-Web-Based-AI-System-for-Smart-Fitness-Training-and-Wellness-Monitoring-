import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import CameraWorkout from './CameraWorkout';
import Overview from './Overview/Overview';
import Progress from './Progress/Progress';
import Achievements from './Achievements/Achievements';
import Nutrition from './Nutrition/Nutrition';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserDashboard = () => {
    const [showCameraWorkout, setShowCameraWorkout] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedTimeframe, setSelectedTimeframe] = useState("week");
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    console.log("Dashboard rendering. User:", user);

    // Real data fetching
    const [achievements, setAchievements] = useState([]);
    const [currentData, setCurrentData] = useState({
        workouts: 0,
        totalTime: 0,
        caloriesBurned: 0,
        totalErrors: 0,
        improvements: []
    });

    const loadDashboardData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/progress");
            const data = await response.json();

            if (data.total_stats) {
                setCurrentData({
                    workouts: data.total_stats.total_workouts || 0,
                    totalTime: Math.round((data.total_stats.total_duration || 0) / 60),
                    caloriesBurned: Math.round((data.total_stats.total_reps || 0) * 0.5),
                    totalErrors: data.total_errors || 0,
                    improvements: data.improvements || []
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
        loadDashboardData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            {showCameraWorkout && (
                <CameraWorkout
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
                            <p className="text-gray-600 dark:text-gray-400">
                                Here's your fitness progress and personalized recommendations.
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex gap-3">
                            <button
                                onClick={() => setShowCameraWorkout(true)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
                            >
                                <i className="ri-camera-line text-lg"></i>
                                Start AI Workout
                            </button>
                            <button className="border-2 border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2">
                                <i className="ri-play-line"></i>
                                Quick Start
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
                        selectedTimeframe={selectedTimeframe}
                        setSelectedTimeframe={setSelectedTimeframe}
                        currentData={currentData}
                    />
                )}

                {activeTab === "achievements" && (
                    <Achievements achievements={achievements} />
                )}
            </motion.div>
        </div>
    );
};

export default UserDashboard;

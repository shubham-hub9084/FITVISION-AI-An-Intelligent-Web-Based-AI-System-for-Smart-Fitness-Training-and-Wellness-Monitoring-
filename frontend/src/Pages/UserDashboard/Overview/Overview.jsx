import React from 'react';
import { motion } from 'framer-motion';

const Overview = ({ currentData, setShowCameraWorkout, achievements }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <motion.div
            className="space-y-6 sm:space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                            <i className="ri-fire-line text-emerald-600 dark:text-emerald-400"></i>
                        </div>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            This Week
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentData.workouts}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Workouts</div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <i className="ri-time-line text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            Total
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentData.totalTime}m
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Training Time</div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                            <i className="ri-flashlight-line text-orange-600 dark:text-orange-400"></i>
                        </div>
                        <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                            Burned
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentData.caloriesBurned}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Calories</div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                            <i className="ri-error-warning-line text-red-600 dark:text-red-400"></i>
                        </div>
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                            Today: {currentData.todayErrors}
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentData.totalErrors}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Form Errors</div>
                </motion.div>
            </div>

            {/* AI Camera Features */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-slate-700">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    AI Camera Features
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center mb-3">
                            <i className="ri-eye-line text-white"></i>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Real-time Pose Detection
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Advanced computer vision analyzes your form and provides
                            instant feedback.
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                            <i className="ri-refresh-line text-white"></i>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Automatic Rep Counting
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            AI automatically counts your repetitions with high accuracy.
                        </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800/50 sm:col-span-2 lg:col-span-1">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
                            <i className="ri-shield-check-line text-white"></i>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Form Correction
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Get instant alerts when your form needs adjustment to
                            prevent injuries.
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setShowCameraWorkout(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 hover:scale-105 hover:shadow-lg text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 cursor-pointer inline-flex items-center gap-2"
                    >
                        <i className="ri-camera-line text-xl"></i>
                        Try AI Camera Workout
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Overview;


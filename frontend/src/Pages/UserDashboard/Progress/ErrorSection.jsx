import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ErrorSection = ({ errorsByWorkout }) => {
    const errorEntries = Array.isArray(errorsByWorkout) ? errorsByWorkout : [];
    const isEmpty = errorEntries.length === 0;
    
    // State to track the currently expanded row index
    const [expandedRow, setExpandedRow] = useState(null);

    const workoutNames = {
        'squat': 'Squats',
        'pushup': 'Push-ups',
        'curl': 'Bicep Curls',
        'shoulder_press': 'Shoulder Press'
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).toLowerCase();
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-slate-700/50 mt-8">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                        <i className="ri-error-warning-line text-red-500"></i>
                        Workout Error History
                    </h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1.5">
                        Click on any workout session row to see a detailed breakdown of your form errors.
                    </p>
                </div>
            </div>

            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100 dark:border-emerald-800/50">
                        <i className="ri-check-double-line text-3xl"></i>
                    </div>
                    <p className="font-bold text-sm tracking-wide">NO ERRORS LOGGED</p>
                    <p className="text-xs mt-1 text-gray-400">Great job maintaining perfect form!</p>
                </div>
            ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden border border-gray-100 dark:border-slate-700 sm:rounded-2xl">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                <thead className="bg-[#6E78E6]">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs sm:text-sm font-semibold text-white tracking-wider">Date</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs sm:text-sm font-semibold text-white tracking-wider">Exercise</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs sm:text-sm font-semibold text-white tracking-wider">Total Errors</th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs sm:text-sm font-semibold text-white tracking-wider">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700/50">
                                    {errorEntries.map((row, idx) => (
                                        <React.Fragment key={idx}>
                                            <motion.tr 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                                                className={`transition-colors duration-200 cursor-pointer ${expandedRow === idx ? 'bg-slate-50 dark:bg-slate-700/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
                                                onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-medium">
                                                    {formatDate(row.date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                        {workoutNames[row.exercise_type] || row.exercise_type}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-bold tabular-nums">
                                                    <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2.5 py-1.5 rounded-md">
                                                        {row.total_errors} Errors
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className={`text-gray-400 transition-transform duration-300 ${expandedRow === idx ? 'rotate-180 text-emerald-500' : 'hover:text-emerald-500'}`}>
                                                        <i className="ri-arrow-down-s-line text-xl"></i>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                            
                                            {/* Expanded Inner Row */}
                                            <AnimatePresence>
                                                {expandedRow === idx && (
                                                    <motion.tr 
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="bg-gray-50/80 dark:bg-slate-800/80 border-b border-gray-100 dark:border-slate-700"
                                                    >
                                                        <td colSpan="4" className="px-6 py-4">
                                                            <div className="pl-6 sm:pl-12 py-3">
                                                                <ul className="space-y-2">
                                                                    {row.error_details.map((detail, dIdx) => (
                                                                        <li key={dIdx} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                                                            <span className="font-medium">{detail.type}</span>
                                                                            <span className="text-gray-400 dark:text-gray-500 tabular-nums text-xs">
                                                                                ({detail.count} times)
                                                                            </span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                )}
                                            </AnimatePresence>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ErrorSection;

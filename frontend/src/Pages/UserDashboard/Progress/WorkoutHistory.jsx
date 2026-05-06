import React from 'react';
import { motion } from 'framer-motion';

const WorkoutHistory = ({ history }) => {
    const workoutEntries = Array.isArray(history) ? history : [];
    const isEmpty = workoutEntries.length === 0;

    const workoutNames = {
        'squat': 'Squats',
        'pushup': 'Push-ups',
        'curl': 'Bicep Curls',
        'shoulder_press': 'Shoulder Press'
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-slate-700/50 mt-8">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                            <i className="ri-history-line text-indigo-600 dark:text-indigo-400"></i>
                        </div>
                        Activity History
                    </h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                        Comprehensive log of your previous workout sessions, reps, and form accuracy.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-900/50 p-1.5 rounded-xl border border-gray-100 dark:border-slate-700">
                    <div className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Sessions</span>
                        <span className="text-lg font-black text-gray-900 dark:text-white">{workoutEntries.length}</span>
                    </div>
                </div>
            </div>

            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-gray-50/50 dark:bg-slate-900/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700/50">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 text-gray-400 rounded-3xl flex items-center justify-center mb-6">
                        <i className="ri-calendar-event-line text-4xl opacity-50"></i>
                    </div>
                    <p className="font-bold text-lg text-gray-600 dark:text-gray-300">No sessions yet</p>
                    <p className="text-sm mt-1 text-gray-400">Complete your first workout to see your history here.</p>
                </div>
            ) : (
                <div className="overflow-x-auto -mx-6 sm:mx-0">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-slate-700">
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Session Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Exercise</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Total Reps</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Accuracy</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                            {workoutEntries.map((row, idx) => {
                                const errorCount = row.error_count || 0;
                                const reps = row.repetitions || 0;
                                // Basic accuracy calculation for UI display
                                const accuracy = reps > 0 ? Math.max(0, Math.round(((reps - (errorCount * 0.5)) / reps) * 100)) : 100;
                                
                                return (
                                    <motion.tr 
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {formatDate(row.completed_at)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                    <i className="ri-flashlight-line text-emerald-600 dark:text-emerald-400 text-sm"></i>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {workoutNames[row.exercise_type] || row.exercise_type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-black tabular-nums">
                                                {reps} Reps
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`text-sm font-bold ${accuracy > 80 ? 'text-emerald-500' : accuracy > 50 ? 'text-orange-500' : 'text-red-500'}`}>
                                                    {accuracy}%
                                                </span>
                                                <div className="w-16 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${accuracy > 80 ? 'bg-emerald-500' : accuracy > 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                                                        style={{ width: `${accuracy}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                            {errorCount > 0 ? (
                                                <span className="text-[10px] font-black uppercase tracking-tighter bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-md">
                                                    {errorCount} Form Errors
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase tracking-tighter bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md">
                                                    Perfect Form
                                                </span>
                                            )}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default WorkoutHistory;

import React from 'react';
import { motion } from 'framer-motion';

const Achievements = ({ achievements, streaks = { current: 0, longest: 0 } }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
    };

    return (
        <motion.div
            className="space-y-6 sm:space-y-8 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* 🔥 Snapchat-style Streak Banner */}
            <motion.div 
                variants={itemVariants}
                className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 rounded-3xl p-6 sm:p-10 shadow-lg shadow-orange-500/20 text-white"
            >
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                            <span className="text-4xl sm:text-5xl filter drop-shadow-md">🔥</span>
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
                                {streaks.current > 0 ? `${streaks.current} Day Streak!` : "Start a Streak!"}
                            </h2>
                            <p className="text-rose-100 font-medium text-sm sm:text-base">
                                {streaks.current > 0 
                                    ? "You're on fire! Complete a workout today to keep it going." 
                                    : "Complete a workout today to ignite your streak tracker!"}
                            </p>
                        </div>
                    </div>
                    <div className="flex bg-black/20 backdrop-blur-md rounded-2xl p-4 gap-6 border border-white/10">
                        <div className="text-center">
                            <div className="text-sm text-rose-200 font-semibold uppercase tracking-wider mb-1">Current</div>
                            <div className="text-3xl font-bold font-mono">{streaks.current}</div>
                        </div>
                        <div className="flex items-center">
                            <div className="h-full w-px bg-white/20"></div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-rose-200 font-semibold uppercase tracking-wider mb-1">Best</div>
                            <div className="text-3xl font-bold font-mono">{streaks.longest}</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Trophy Room
                    </h2>
                </div>

                {/* Achievement Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <div className="text-center p-5 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                        <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">
                            {achievements.filter((a) => a.earned).length}
                        </div>
                        <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 dark:text-indigo-300">Badges</div>
                    </div>
                    <div className="text-center p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                        <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
                            {achievements.reduce((sum, a) => sum + (a.earned ? a.points : 0), 0)}
                        </div>
                        <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 dark:text-emerald-300">Points</div>
                    </div>
                    <div className="text-center p-5 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                        <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-1">
                            {achievements.filter((a) => !a.earned).length}
                        </div>
                        <div className="text-xs font-bold uppercase tracking-widest text-purple-400 dark:text-purple-300">Locked</div>
                    </div>
                    <div className="text-center p-5 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="text-3xl font-black text-slate-600 dark:text-slate-400 mb-1">0</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Events</div>
                    </div>
                </div>

                {/* Achievement Badges List */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((achievement) => (
                        <motion.div
                            variants={itemVariants}
                            key={achievement.id}
                            className={`relative overflow-hidden p-6 rounded-3xl transition-all duration-300 ${
                                achievement.earned
                                    ? "bg-gradient-to-br from-gray-900 to-slate-800 text-white shadow-xl shadow-indigo-900/20 border border-slate-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/30"
                                    : "bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 opacity-80 backdrop-blur-sm"
                            }`}
                        >
                            {/* Premium Glow Effect for Earned Badges */}
                            {achievement.earned && (
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500 opacity-20 rounded-full blur-3xl mix-blend-screen"></div>
                            )}

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                                            achievement.earned
                                                ? "bg-gradient-to-br from-indigo-400 to-purple-500 text-white ring-2 ring-white/20"
                                                : "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500"
                                        }`}
                                    >
                                        <i className={achievement.icon}></i>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest ${
                                        achievement.earned 
                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                                            : "bg-gray-200 dark:bg-slate-700 text-gray-500"
                                    }`}>
                                        {achievement.points} PT
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className={`text-lg font-bold mb-2 ${achievement.earned ? "text-white" : "text-gray-900 dark:text-white"}`}>
                                        {achievement.title}
                                    </h3>
                                    <p className={`text-sm mb-6 ${achievement.earned ? "text-slate-300" : "text-gray-500 dark:text-slate-400"}`}>
                                        {achievement.description}
                                    </p>
                                </div>

                                <div>
                                    {achievement.earned ? (
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                                                <i className="ri-verified-badge-fill text-indigo-400"></i>
                                                Unlocked
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                                                <span>Progress</span>
                                                <span className="text-gray-900 dark:text-white">
                                                    {achievement.progress} / {achievement.total}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden shadow-inner">
                                                <div
                                                    className="bg-gray-400 dark:bg-slate-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                                    style={{
                                                        width: `${(achievement.progress / achievement.total) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Achievements;

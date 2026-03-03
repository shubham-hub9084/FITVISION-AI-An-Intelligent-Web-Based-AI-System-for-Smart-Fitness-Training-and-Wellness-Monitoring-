import React from 'react';
import { motion } from 'framer-motion';

const Achievements = ({ achievements }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
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
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-slate-700">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Your Achievements
                </h2>

                {/* Achievement Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {achievements.filter((a) => a.earned).length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Earned</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {achievements.reduce(
                                (sum, a) => sum + (a.earned ? a.points : 0),
                                0
                            )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {achievements.filter((a) => !a.earned).length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">0</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
                    </div>
                </div>

                {/* Achievement List */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    {achievements.map((achievement) => (
                        <motion.div
                            variants={itemVariants}
                            key={achievement.id}
                            className={`p-6 rounded-xl border-2 transition-transform hover:scale-[1.02] cursor-pointer ${achievement.earned
                                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50"
                                : "bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600"
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.earned
                                        ? "bg-emerald-600 text-white"
                                        : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                                        }`}
                                >
                                    <i className={`${achievement.icon} text-lg`}></i>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        {achievement.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                        {achievement.description}
                                    </p>

                                    {achievement.earned ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                                                +{achievement.points} points
                                            </span>
                                            <span className="text-gray-400 text-xs">•</span>
                                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                {achievement.date}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-emerald-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(achievement.progress / achievement.total) *
                                                        100
                                                        }%`,
                                                }}
                                            ></div>
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

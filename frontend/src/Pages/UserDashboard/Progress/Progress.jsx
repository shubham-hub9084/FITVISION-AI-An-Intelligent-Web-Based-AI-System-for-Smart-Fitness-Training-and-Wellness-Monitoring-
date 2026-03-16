import { motion } from 'framer-motion';

const Progress = ({ selectedTimeframe, setSelectedTimeframe, currentData }) => {
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
            {/* Timeframe Selector */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
                        Review Progress
                    </h2>
                    <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                        {[
                            { id: "week", label: "Week" },
                            { id: "month", label: "Month" },
                            { id: "year", label: "Year" },
                        ].map((period) => (
                            <button
                                key={period.id}
                                onClick={() => setSelectedTimeframe(period.id)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${selectedTimeframe === period.id
                                    ? "bg-white dark:bg-slate-600 text-emerald-600 dark:text-emerald-400 shadow-sm"
                                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Progress Charts */}
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Workout Performance
                        </h3>
                        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 dark:from-emerald-600 dark:to-blue-600 rounded-lg p-6 text-white">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-2xl font-bold">
                                        {currentData.workouts}
                                    </div>
                                    <div className="text-emerald-100 dark:text-emerald-50 text-sm">
                                        Total Workouts
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-red-100">
                                        {currentData.totalErrors}
                                    </div>
                                    <div className="text-emerald-100 dark:text-emerald-50 text-sm">
                                        Total Errors Logged
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Exercise Improvements
                        </h3>
                        <div className="space-y-3">
                            <div className="space-y-3">
                                {currentData.improvements && currentData.improvements.length > 0 ? (
                                    currentData.improvements.map((improvement, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                                        >
                                            <span className="font-medium text-gray-900 dark:text-white capitalize">
                                                {improvement.exercise}
                                            </span>
                                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                                {improvement.improvement}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No workout data yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Detailed Analytics */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Calories Burned
                        </h3>
                        <i className="ri-fire-line text-orange-500 text-xl"></i>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {currentData.caloriesBurned}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        This {selectedTimeframe}
                    </div>
                    <div className="mt-4 h-2 bg-gray-200 dark:bg-slate-700 rounded-full">
                        <div className="h-full bg-orange-500 rounded-full w-3/4"></div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Training Time</h3>
                        <i className="ri-time-line text-blue-500 text-xl"></i>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {currentData.totalTime}m
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total duration</div>
                    <div className="mt-4 h-2 bg-gray-200 dark:bg-slate-700 rounded-full">
                        <div className="h-full bg-blue-500 rounded-full w-4/5"></div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Progress;

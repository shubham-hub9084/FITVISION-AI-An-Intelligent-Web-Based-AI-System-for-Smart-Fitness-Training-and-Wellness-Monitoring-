import { motion } from 'framer-motion';
import ProgressChart from './ProgressChart';
import WorkoutHistory from './WorkoutHistory';

const Progress = ({ currentData, user_id }) => {
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
            {/* Progress Visualization */}
            <motion.div variants={itemVariants}>
                <ProgressChart user_id={user_id} />
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
                        This Week
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

            {/* Workout History Section */}
            <motion.div variants={itemVariants}>
                <WorkoutHistory history={currentData.history} />
            </motion.div>
        </motion.div>
    );
};

export default Progress;

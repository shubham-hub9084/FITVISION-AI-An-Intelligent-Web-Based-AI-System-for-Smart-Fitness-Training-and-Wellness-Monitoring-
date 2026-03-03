import React from 'react';

const Nutrition = ({ nutritionTips }) => {
    return (
        <div className="space-y-6 sm:space-y-8" >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Nutrition Insights
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    {nutritionTips.map((tip, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-700"
                        >
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i className={`${tip.icon} text-emerald-600 dark:text-emerald-400`}></i>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {tip.title}
                                    </h3>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300">
                                        {tip.category}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{tip.tip}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Nutrition;

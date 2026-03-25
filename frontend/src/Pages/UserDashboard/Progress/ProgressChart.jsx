import React, { useState, useEffect } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label
} from 'recharts';
import config from '../../../config';

const ProgressChart = ({ user_id }) => {
    const [data, setData] = useState([]);
    const days = 7; 
    const [loading, setLoading] = useState(true);

    const fetchChartData = async () => {
        if (!user_id) return;
        try {
            const response = await fetch(`${config.API_BASE_URL}/api/chart_data?user_id=${user_id}&days=${days}`);
            const result = await response.json();
            
            // Generate the last 7 days as a continuous timeline
            const today = new Date();
            const dateMap = {};
            
            for (let i = days - 1; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                // Use ISO string (YYYY-MM-DD) for robust matching
                const isoDate = d.toISOString().split('T')[0];
                dateMap[isoDate] = { date: isoDate };
                // Initialize all exercises to 0
                chartConfig.forEach(config => {
                    dateMap[isoDate][config.key] = 0;
                });
            }

            // Fill in the actual data from the backend
            result.forEach(item => {
                // Backend now returns ISO dates
                if (dateMap[item.date]) {
                    Object.keys(item).forEach(key => {
                        if (key !== 'date' && key !== 'Errors') {
                            dateMap[item.date][key] = item[key];
                        }
                    });
                }
            });

            // Convert map back to array and sort to ensure chronological order
            const filledData = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
            
            // TRIM LOGIC: Avoid showing empty days *before* the user's first workout
            let firstActiveIndex = filledData.findIndex(day => 
                chartConfig.some(config => day[config.key] > 0)
            );
            
            // If they have worked out, trim the array starting from one day BEFORE their 
            // first active workout (so the chart has a zero-point to visibly slope upwards from)
            let trimmedData = filledData;
            if (firstActiveIndex !== -1) {
                const startIndex = Math.max(0, firstActiveIndex - 1);
                trimmedData = filledData.slice(startIndex);
            }
            
            setData(trimmedData);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch chart data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChartData();
        const interval = setInterval(fetchChartData, 30000);
        return () => clearInterval(interval);
    }, [user_id]);

    // Premium SaaS Color Config (Linear/Stripe inspired)
    const chartConfig = [
        { key: 'Squats', color: '#6366f1', gradientId: 'colorSquats' },     // Indigo
        { key: 'Push-ups', color: '#10b981', gradientId: 'colorPushups' }, // Emerald
        { key: 'Bicep Curls', color: '#f59e0b', gradientId: 'colorCurls' }, // Amber
        { key: 'Shoulder Press', color: '#ec4899', gradientId: 'colorPress' } // Pink/Rose
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-xl">
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-3 tracking-wider uppercase">
                        {new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <div className="space-y-2">
                        {payload.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between gap-8">
                                <div className="flex items-center gap-2.5">
                                    <div 
                                        className="w-2.5 h-2.5 rounded-full ring-2 ring-white/10 dark:ring-black/20" 
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                        {entry.name}
                                    </span>
                                </div>
                                <span className="text-gray-900 dark:text-white text-sm font-bold font-mono">
                                    {entry.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-700/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Performance Flow</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total volume grouped by exercise</p>
                    </div>
                </div>
            </div>

            <div className="h-[400px] w-full mt-2 font-sans">
                {loading ? (
                    <div className="h-full w-full flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-[2px] border-emerald-500/20 border-b-emerald-500"></div>
                        </div>
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-full w-full flex flex-col items-center justify-center text-gray-400">
                        <i className="ri-bar-chart-2-line text-4xl mb-3 opacity-30"></i>
                        <p className="font-semibold text-sm">No workout data available</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                {chartConfig.map(config => (
                                    <linearGradient key={config.gradientId} id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={config.color} stopOpacity={0.25}/>
                                        <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid 
                                strokeDasharray="4 4" 
                                stroke="currentColor" 
                                className="text-gray-100 dark:text-slate-700/40" 
                                vertical={false} 
                            />
                             <XAxis 
                                dataKey="date" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                                dy={10}
                                minTickGap={20}
                                tickFormatter={(dateStr) => {
                                    const d = new Date(dateStr);
                                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                }}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                                dx={-10}
                            />
                            <Tooltip 
                                content={<CustomTooltip />} 
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.4 }} 
                            />
                            <Legend 
                                verticalAlign="top" 
                                align="right"
                                height={40}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}
                            />
                            
                            {chartConfig.map((config) => (
                                <Area
                                    key={config.key}
                                    type="monotone"
                                    name={config.key}
                                    dataKey={config.key}
                                    stroke={config.color}
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill={`url(#${config.gradientId})`}
                                    activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: config.color }}
                                    animationDuration={1500}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default ProgressChart;

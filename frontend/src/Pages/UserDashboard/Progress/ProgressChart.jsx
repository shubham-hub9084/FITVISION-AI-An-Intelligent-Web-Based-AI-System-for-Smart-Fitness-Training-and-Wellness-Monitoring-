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
            setData(result);
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

    // Exercise Config matching screenshot + 4 core exercises
    const chartConfig = [
        { key: 'Squats', color: '#3b82f6', gradientId: 'colorSquats' },
        { key: 'Push-ups', color: '#10b981', gradientId: 'colorPushups' },
        { key: 'Bicep Curls', color: '#f59e0b', gradientId: 'colorCurls' },
        { key: 'Shoulder Press', color: '#8b5cf6', gradientId: 'colorPress' }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl backdrop-blur-md bg-opacity-90">
                    <p className="text-gray-400 text-xs font-bold mb-3 uppercase tracking-widest border-b border-slate-700 pb-2">
                        {label}
                    </p>
                    <div className="space-y-2.5">
                        {payload.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.3)]" 
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-gray-300 text-sm font-medium">
                                        {entry.name}
                                    </span>
                                </div>
                                <span className="text-white text-sm font-bold tabular-nums">
                                    {entry.value} reps
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
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-slate-700/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Performance Analytics</h2>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Live monitoring: Weekly exercise & form accuracy</p>
                    </div>
                </div>
                
                <div className="mt-4 sm:mt-0 px-4 py-2 bg-slate-50 dark:bg-slate-700/30 rounded-full border border-slate-100 dark:border-slate-700/50">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">7 Days Overview</span>
                </div>
            </div>

            <div className="h-[450px] w-full mt-4">
                {loading ? (
                    <div className="h-full w-full flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-emerald-500/20 border-b-emerald-500"></div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Analytics...</span>
                        </div>
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-full w-full flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700/30 rounded-2xl flex items-center justify-center mb-4">
                            <i className="ri-bar-chart-line text-3xl opacity-20"></i>
                        </div>
                        <p className="font-bold text-sm tracking-wide">NO RECENT WORKOUT DATA</p>
                        <p className="text-xs mt-1 text-gray-400">Complete a session to see your progress graph</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                            <defs>
                                {chartConfig.map(config => (
                                    <linearGradient key={config.gradientId} id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={config.color} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="currentColor" 
                                className="text-gray-200 dark:text-slate-700/50" 
                                vertical={false} 
                            />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                dy={15}
                            >
                                <Label 
                                    value="COMPLETION DATE" 
                                    offset={-10} 
                                    position="insideBottom" 
                                    style={{ fill: '#64748b', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.1em' }} 
                                />
                            </XAxis>
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                dx={-10}
                            >
                                <Label 
                                    value="ACTIVITY COUNT (REPS)" 
                                    angle={-90} 
                                    position="insideLeft" 
                                    style={{ fill: '#64748b', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.1em', textAnchor: 'middle' }} 
                                />
                            </YAxis>
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1 }} />
                            <Legend 
                                verticalAlign="top" 
                                align="right"
                                height={50}
                                iconType="circle"
                                wrapperStyle={{ paddingBottom: '40px', fontSize: '12px', fontWeight: 'bold' }}
                            />
                            
                            {chartConfig.map((config) => (
                                <Area
                                    key={config.key}
                                    type="monotone"
                                    name={config.key}
                                    dataKey={config.key}
                                    stroke={config.color}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill={`url(#${config.gradientId})`}
                                    activeDot={{ r: 6, strokeWidth: 0, fill: config.color }}
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

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../../config';
import { playBeep } from '../../utils/soundUtils';

const CameraWorkout = ({ onClose, onWorkoutComplete }) => {
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [permissionGranted, setPermissionGranted] = useState(true);
    const [repCount, setRepCount] = useState(0);
    const [feedback, setFeedback] = useState("Ready to start");
    const [stage, setStage] = useState("Ready");
    const [alerts, setAlerts] = useState([]);
    const [sessionActive, setSessionActive] = useState(false);

    // Report State
    const [showReport, setShowReport] = useState(false);
    const [reportData, setReportData] = useState(null);

    // Fetch Exercises on Mount
    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}/api/exercises`);
                const data = await response.json();
                setExercises(data);
            } catch (error) {
                console.error("Failed to fetch exercises", error);
            }
        };
        fetchExercises();
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (sessionActive) stopSession();
        };
    }, [sessionActive]);

    const startSession = async (exerciseId) => {
        setSelectedExercise(exerciseId);
        try {
            const response = await fetch(`${config.API_BASE_URL}/api/start_session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exercise: exerciseId })
            });
            const data = await response.json();
            if (data.status === 'success') {
                setSessionActive(true);
            }
        } catch (error) {
            console.error("Failed to start session:", error);
            setFeedback("Connection Error");
        }
    };

    const stopSession = async () => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/api/stop_session`, { method: 'POST' });
            const data = await response.json();

            if (data.status === 'success') {
                setSessionActive(false);
                setReportData(data.report);
                playBeep('complete');
                setShowReport(true);

                // Refresh dashboard stats directly
                if (onWorkoutComplete) {
                    onWorkoutComplete();
                }
            }
        } catch (error) {
            console.error("Failed to stop session:", error);
            onClose(); // Force close if error
        }
    };

    const resetCounter = async () => {
        try {
            await fetch(`${config.API_BASE_URL}/api/reset_counter`, { method: 'POST' });
            setRepCount(0);
            setFeedback("Counter Reset");
        } catch (error) {
            console.error("Reset failed", error);
        }
    };

    // Poll for stats
    useEffect(() => {
        if (!sessionActive) return;

        const interval = setInterval(async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}/api/current_stats`);
                const data = await response.json();

                if (data.active) {
                    setRepCount(data.repetitions);
                    setStage(data.stage);
                    if (data.feedback && data.feedback.length > 0) {
                        setFeedback(data.feedback[data.feedback.length - 1]);
                    }
                    if (data.alerts) {
                        setAlerts(data.alerts);
                    }
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [sessionActive]);

    // Sound and Visual effects when reps increase
    useEffect(() => {
        if (repCount > 0) {
            playBeep('success');
        }
    }, [repCount]);

    // Sound for feedback (optional, maybe just for specific words like "Incorrect")
    useEffect(() => {
        if (feedback && (feedback.toLowerCase().includes('wrong') || feedback.toLowerCase().includes('incorrect') || feedback.toLowerCase().includes('adjust'))) {
            // playBeep('warning'); // Optional: might be too annoying if frequent
        }
    }, [feedback]);


    // 1. Exercise Selection Screen
    if (!selectedExercise) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                >
                    <div className="w-full max-w-2xl bg-gray-900 rounded-2xl p-8 border border-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Select Exercise</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white">
                                <i className="ri-close-line text-2xl"></i>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {exercises.map((ex) => (
                                <button
                                    key={ex.id}
                                    onClick={() => startSession(ex.id)}
                                    className="p-6 bg-gray-800 hover:bg-emerald-600/20 border border-gray-700 hover:border-emerald-500 rounded-xl transition-all text-left group"
                                >
                                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 mb-2">
                                        {ex.name}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {ex.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // 2. Report Screen
    if (showReport && reportData) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
                >
                    <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border-4 border-emerald-500 mb-4">
                                <span className="text-3xl font-bold text-emerald-500">{reportData.score}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Session Complete!</h2>
                            <p className="text-gray-400 text-sm">{reportData.summary}</p>
                        </div>

                        <div className="bg-gray-800/50 rounded-xl p-4 mb-6 text-left">
                            <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
                                Coach's Tips
                            </h3>
                            <ul className="space-y-2">
                                {reportData.tips.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <i className="ri-lightbulb-flash-line text-yellow-500 mt-0.5"></i>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-gray-800 rounded-lg">
                                <div className="text-2xl font-bold text-white">{reportData.total_reps}</div>
                                <div className="text-xs text-gray-500">Total Reps</div>
                            </div>
                            <div className="p-3 bg-gray-800 rounded-lg">
                                <div className="text-2xl font-bold text-red-500">{reportData.error_count}</div>
                                <div className="text-xs text-gray-500">Form Errors</div>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // 3. Active Workout Screen
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            >
                <div className="relative w-full max-w-5xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl mx-4">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                        <div className="flex items-center gap-3">
                            <span className="bg-red-500 w-3 h-3 rounded-full animate-pulse"></span>
                            <span className="text-white font-semibold">Live Analysis</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={resetCounter}
                                className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-xs text-white transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={stopSession}
                                className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors"
                            >
                                <i className="ri-close-line text-2xl"></i>
                            </button>
                        </div>
                    </div>

                    {/* Backend Stream */}
                    <div className="relative bg-black border-b border-gray-800 flex justify-center">
                        <img
                            src={`${config.API_BASE_URL}/video_feed`}
                            alt="AI Stream"
                            className="w-full h-auto max-h-[60vh] object-contain transform scale-x-[-1]"
                        />
                    </div>

                    {/* Dedicated Feedback Panel (Outside Video) */}
                    <div className="p-6 bg-gray-900 border-b border-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Left: Exercise & Stage */}
                            <div className="bg-gray-800 p-5 rounded-xl flex flex-col justify-center border border-gray-700">
                                <h3 className="text-emerald-400 font-bold mb-2 uppercase tracking-wide text-sm">
                                    {selectedExercise}
                                </h3>
                                <div className="text-sm text-gray-300 font-medium flex items-center gap-2">
                                    <span className="opacity-60">Stage:</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase
                                        ${stage === 'Up' ? 'bg-emerald-500/20 text-emerald-400' :
                                            stage === 'Down' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-gray-700 text-gray-300'}
                                    `}>
                                        {stage}
                                    </span>
                                </div>
                            </div>

                            {/* Center: Feedback & Alerts */}
                            <div className="col-span-1 md:col-span-1 flex flex-col gap-3">
                                {/* Form Feedback */}
                                <div className={`
                                    p-4 rounded-xl border-l-4 transition-all duration-300 flex-1 flex items-center
                                    ${feedback.toLowerCase().includes('ready') ? 'bg-blue-500/10 border-blue-500 text-blue-400' :
                                        feedback.toLowerCase().includes('good') || feedback.toLowerCase().includes('great') || feedback.toLowerCase().includes('perfect') || feedback.toLowerCase().includes('correct') ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' :
                                            'bg-red-500/10 border-red-500 text-red-500 font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)]'}
                                `}>
                                    <p className="text-lg font-bold leading-tight">
                                        {feedback}
                                    </p>
                                </div>

                                {/* Safety Alerts */}
                                {alerts && alerts.length > 0 && (
                                    <div className="p-3 bg-red-500/20 border border-red-500 rounded-xl space-y-2 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                                        {alerts.map((alert, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-red-500 text-sm font-bold">
                                                <i className="ri-error-warning-fill animate-pulse text-lg"></i>
                                                <span>{alert.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right: Reps */}
                            <div className="bg-gray-800 p-5 rounded-xl flex flex-col items-center justify-center border border-gray-700">
                                <div className="text-6xl font-bold text-white mb-1 tracking-tighter">{repCount}</div>
                                <div className="text-gray-400 text-xs font-medium tracking-widest uppercase">Repetitions</div>
                            </div>

                        </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="p-4 bg-gray-900 border-t border-gray-800 flex justify-center">
                        <button
                            onClick={stopSession}
                            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all active:scale-95"
                        >
                            Finish Workout
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CameraWorkout;

import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import CameraWorkout from '../Pages/UserDashboard/CameraWorkout';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Workouts = () => {
  const [activeWorkoutId, setActiveWorkoutId] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const workoutPrograms = [
    {
      id: 1,
      exerciseId: "squat",
      title: "Squats",
      duration: 20,
      calories: 200,
      exercises: 1,
      muscleGroup: "Legs & Glutes",
      description: "Master the king of lower-body exercises. AI tracks your depth, knee alignment and back posture in real time.",
      image: "/images/workouts/squat.png",
      icon: "ri-walk-line",
      color: "emerald",
      rating: 4.9,
      completions: 32400
    },
    {
      id: 2,
      exerciseId: "pushup",
      title: "Push-ups",
      duration: 15,
      calories: 150,
      exercises: 1,
      muscleGroup: "Chest & Triceps",
      description: "Build upper-body strength with correct form. AI monitors your elbow angle, body planarity and range of motion.",
      image: "/images/workouts/pushup.png",
      icon: "ri-arrow-down-circle-line",
      color: "blue",
      rating: 4.8,
      completions: 28700
    },
    {
      id: 3,
      exerciseId: "curl",
      title: "Bicep Curls",
      duration: 15,
      calories: 120,
      exercises: 1,
      muscleGroup: "Biceps & Forearms",
      description: "Isolate and grow your biceps with proper technique. AI checks your elbow position and curl angle every rep.",
      image: "/images/workouts/curl.png",
      icon: "ri-boxing-line",
      color: "purple",
      rating: 4.7,
      completions: 21500
    },
    {
      id: 4,
      exerciseId: "shoulder_press",
      title: "Shoulder Press",
      duration: 20,
      calories: 175,
      exercises: 1,
      muscleGroup: "Shoulders & Traps",
      description: "Build powerful shoulders safely. AI tracks your press path, elbow flare and lockout to protect your joints.",
      image: "/images/workouts/shoulder_press.png",
      icon: "ri-arrow-up-circle-line",
      color: "orange",
      rating: 4.8,
      completions: 18900
    }
  ];

  const aiFeatures = [
    {
      title: "Real-Time Form Analysis",
      description: "AI monitors your movements and provides instant feedback on exercise form",
      icon: "ri-eye-line",
      color: "emerald"
    },
    {
      title: "Automatic Rep Counting",
      description: "Never lose count again with intelligent rep detection",
      icon: "ri-refresh-line",
      color: "blue"
    },
    {
      title: "Personalized Adjustments",
      description: "AI adapts workout intensity based on your performance",
      icon: "ri-user-heart-line",
      color: "purple"
    },
    {
      title: "Injury Prevention",
      description: "Get alerts when form breaks down to prevent injuries",
      icon: "ri-shield-check-line",
      color: "orange"
    }
  ];



  const getColorClasses = (color) => {
    const map = {
      emerald: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-300 dark:border-emerald-700", badge: "bg-emerald-500" },
      blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", border: "border-blue-300 dark:border-blue-700", badge: "bg-blue-500" },
      purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", border: "border-purple-300 dark:border-purple-700", badge: "bg-purple-500" },
      orange: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", border: "border-orange-300 dark:border-orange-700", badge: "bg-orange-500" },
    };
    return map[color] || map.emerald;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {activeWorkoutId && (
        <CameraWorkout
          initialExerciseId={activeWorkoutId}
          onClose={() => setActiveWorkoutId(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />

        {/* Page Header */}
        <div className="mb-10 mt-4" data-aos="fade-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            AI-Powered Workouts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base max-w-2xl">
            Choose an exercise below. Your camera feeds into our AI engine for live rep counting, form feedback, and injury alerts.
          </p>
        </div>

        {/* AI Features Strip */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">How the AI Coaches You</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiFeatures.map((feature, index) => {
              const c = getColorClasses(feature.color);
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                >
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-3 ${c.bg}`}>
                    <i className={`${feature.icon} text-xl ${c.text}`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>



        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {workoutPrograms.length} AI-Powered Workouts
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {workoutPrograms.map((workout, index) => {
              const c = getColorClasses(workout.color);
              return (
                <div
                  key={workout.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                >
                  <div className="relative w-full aspect-video overflow-hidden bg-gray-100 dark:bg-slate-700">
                    <img
                      src={workout.image}
                      alt={workout.title}
                      className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{workout.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex-1">{workout.description}</p>

                    <button
                      onClick={() => setActiveWorkoutId(workout.exerciseId)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30"
                    >
                      <i className="ri-camera-line"></i>
                      Start {workout.title}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


      </div>
    </div>
  );
};

export default Workouts;

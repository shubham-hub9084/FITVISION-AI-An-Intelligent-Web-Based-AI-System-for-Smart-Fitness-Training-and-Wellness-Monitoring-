import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-2xl w-full text-center space-y-8" data-aos="fade-up">

        {/* Animated Icon/Illustration */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-[15rem] font-black text-emerald-900 dark:text-emerald-400 select-none transition-colors">404</span>
          </div>
          <div className="relative z-10 flex justify-center mb-8">
            <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center animate-float transition-colors">
              <i className="ri-compass-dismiss-line text-6xl text-emerald-600 dark:text-emerald-400"></i>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto transition-colors">
            Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <button
            onClick={() => navigate('/')}
            className="group px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 dark:shadow-none transition-all hover:-translate-y-1 flex items-center gap-2"
          >
            <i className="ri-home-4-line text-xl group-hover:scale-110 transition-transform"></i>
            Back to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="group px-8 py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl font-semibold transition-all hover:-translate-y-1 flex items-center gap-2"
          >
            <i className="ri-arrow-left-line text-xl group-hover:-translate-x-1 transition-transform"></i>
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="pt-12 border-t border-gray-200 dark:border-slate-700 transition-colors">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors">You might want to check out:</p>
          <div className="flex flex-wrap justify-center gap-6">
            <button onClick={() => navigate('/dashboard')} className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors flex items-center gap-2">
              <i className="ri-dashboard-line"></i> Dashboard
            </button>
            <button onClick={() => navigate('/workouts')} className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors flex items-center gap-2">
              <i className="ri-fitness-fill"></i> Workouts
            </button>
            <button onClick={() => navigate('/meal-plans')} className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors flex items-center gap-2">
              <i className="ri-restaurant-line"></i> Meal Plans
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
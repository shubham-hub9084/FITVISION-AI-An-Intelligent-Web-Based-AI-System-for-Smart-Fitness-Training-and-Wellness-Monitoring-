import React, { useEffect } from 'react'
import 'remixicon/fonts/remixicon.css'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Features = () => {


  return (
    <div>
      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16" data-aos="fade-down">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Intelligent Features</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-2">
              Experience cutting-edge AI technology that revolutionizes how you train, track progress, and achieve your fitness goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 p-6 sm:p-8 rounded-2xl border border-transparent dark:border-emerald-800/30"
              data-aos="fade-up" data-aos-delay="0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <i className="ri-eye-line text-white text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Real-time Pose Correction</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                Advanced computer vision analyzes your form instantly, providing immediate feedback to ensure perfect technique and prevent injuries.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-emerald-600 dark:text-emerald-400"></i>
                  Instant form analysis
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-emerald-600 dark:text-emerald-400"></i>
                  Joint angle detection
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-emerald-600 dark:text-emerald-400"></i>
                  Movement quality scoring
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 sm:p-8 rounded-2xl border border-transparent dark:border-blue-800/30"
              data-aos="fade-up" data-aos-delay="100">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <i className="ri-bar-chart-line text-white text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Smart Progress Tracking</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                Comprehensive analytics dashboard tracks your performance, calories burned, and improvement trends over time.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-blue-600 dark:text-blue-400"></i>
                  Automatic rep counting
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-blue-600 dark:text-blue-400"></i>
                  Performance analytics
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-blue-600 dark:text-blue-400"></i>
                  Goal achievement tracking
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6 sm:p-8 rounded-2xl md:col-span-2 lg:col-span-1 border border-transparent dark:border-purple-800/30"
              data-aos="fade-up" data-aos-delay="200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <i className="ri-gamepad-line text-white text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Gamification &amp; Motivation</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                Stay motivated with achievement badges, streak counters, challenges, and leaderboards that make fitness fun and engaging.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-purple-600 dark:text-purple-400"></i>
                  Achievement badges
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-purple-600 dark:text-purple-400"></i>
                  Weekly challenges
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-purple-600 dark:text-purple-400"></i>
                  Community leaderboards
                </li>
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1" data-aos="fade-right">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Personalized Nutrition Guidance</h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                Get evidence-based nutrition recommendations, meal plans, and supplement guidance tailored to your fitness goals and dietary preferences.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-restaurant-line text-emerald-600 dark:text-emerald-400"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Custom Meal Plans</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Personalized nutrition plans based on your goals, preferences, and dietary restrictions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-medicine-bottle-line text-emerald-600 dark:text-emerald-400"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Smart Supplements</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Evidence-based supplement recommendations to optimize your training and recovery.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-calendar-line text-emerald-600 dark:text-emerald-400"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Meal Timing</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Optimal nutrition timing to fuel your workouts and enhance recovery.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2" data-aos="fade-left">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 group">
                <img
                  src="https://readdy.ai/api/search-image?query=Healthy%20meal%20prep%20containers%20with%20colorful%20nutritious%20foods%2C%20fresh%20vegetables%2C%20lean%20proteins%2C%20whole%20grains%2C%20modern%20kitchen%20setting%2C%20clean%20organized%20layout%2C%20natural%20lighting%2C%20health%20and%20wellness%20aesthetic&width=600&height=500&seq=nutrition1&orientation=landscape"
                  alt="Personalized nutrition guidance with meal prep containers"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  style={{ aspectRatio: '4/3' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Features

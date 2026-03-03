import React from 'react'
import { GiNachos } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Getstarted = ({ showGetStartedModal, setShowGetStartedModal }) => {
  const nav = useNavigate()
  const { user, openSignUp, updateProfile } = useAuth()

  const handleStartTraining = async (e) => {
    e.preventDefault()

    // Collect form data
    const formData = new FormData(e.target);
    const data = {
      goal: formData.get('fitnessGoal'),
      experience: formData.get('experience'),
      frequency: formData.get('frequency'),
      // Collect other fields if needed, e.g. workoutTypes
    };

    // Save to profile
    if (user) {
      await updateProfile(data);
    }

    nav("/dashboard")
    setShowGetStartedModal(false)
  }

  const handleSignIn = () => {
    openSignUp(); // Or openSignIn
  }

  return (
    <div>
      {/* Get Started Modal */}
      {showGetStartedModal && (
        <div className="fixed inset-0 bg-white/50 dark:bg-slate-900/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-colors duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto shadow-xl border border-gray-100 dark:border-slate-700 transition-colors duration-300">
            <button
              onClick={() => setShowGetStartedModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition-colors"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>

            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-rocket-line text-emerald-600 dark:text-emerald-400 text-xl sm:text-2xl"></i>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Start Your AI Training Journey
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Let's set up your personalized fitness profile to get the most out of FitVision AI
              </p>
            </div>

            {!user ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-6">Please sign in or create an account to start your training journey.</p>
                <button
                  onClick={handleSignIn}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:shadow-lg transition-all"
                >
                  Sign In / Sign Up
                </button>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Powered by <span className="font-semibold text-gray-700 dark:text-gray-300">Clerk</span> Authentication
                </p>
              </div>
            ) : (
              <form onSubmit={handleStartTraining} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      defaultValue={user.first_name || user.full_name?.split(' ')[0]}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      defaultValue={user.last_name || (user.full_name?.split(' ').length > 1 ? user.full_name?.split(' ')[1] : '')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="fitnessGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fitness Goal</label>
                  <select
                    id="fitnessGoal"
                    name="fitnessGoal"
                    required
                    defaultValue={user.goal || ""}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm pr-8 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors"
                  >
                    <option value="">Select your primary goal</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="strength">Build Strength</option>
                    <option value="endurance">Improve Endurance</option>
                    <option value="flexibility">Increase Flexibility</option>
                    <option value="general">General Fitness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" id="experience-label">Experience Level</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors" aria-labelledby="experience-label">
                      <input type="radio" name="experience" value="beginner" className="mr-3 accent-emerald-600" required aria-label="Beginner experience level" />
                      <div>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">Beginner</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">0-6 months</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors" aria-labelledby="experience-label">
                      <input type="radio" name="experience" value="intermediate" className="mr-3 accent-emerald-600" required aria-label="Intermediate experience level" />
                      <div>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">Intermediate</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">6+ months</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors" aria-labelledby="experience-label">
                      <input type="radio" name="experience" value="advanced" className="mr-3 accent-emerald-600" required aria-label="Advanced experience level" />
                      <div>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">Advanced</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">2+ years</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" id="frequency-label">Workout Frequency</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['2-3 days', '3-4 days', '4-5 days', '6+ days'].map((freq, index) => (
                      <label key={index} className="flex items-center justify-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 text-sm text-gray-700 dark:text-gray-300 transition-colors" aria-labelledby="frequency-label">
                        <input type="radio" name="frequency" value={freq} className="mr-2 accent-emerald-600" required aria-label={`Workout frequency: ${freq}`} />
                        {freq}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" id="workoutTypes-label">Preferred Workout Types</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'strength', label: 'Strength Training', icon: 'ri-sword-line' },
                      { id: 'cardio', label: 'Cardio', icon: 'ri-heart-pulse-line' },
                      { id: 'yoga', label: 'Yoga & Flexibility', icon: 'ri-leaf-line' },
                      { id: 'hiit', label: 'HIIT', icon: 'ri-flashlight-line' }
                    ].map((type) => (
                      <label key={type.id} className="flex items-center p-3 border border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors" aria-labelledby="workoutTypes-label">
                        <input type="checkbox" name="workoutTypes" value={type.id} className="mr-3 accent-emerald-600" aria-label={type.label} />
                        <i className={`${type.icon} text-emerald-600 mr-2`} aria-hidden="true"></i>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setShowGetStartedModal(false)}
                    className="flex-1 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"

                  >
                    Start My Training
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By starting your training, you agree to our{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-700 cursor-pointer">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-700 cursor-pointer">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Getstarted

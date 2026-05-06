import React from 'react'

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
      workoutTypes: formData.getAll('workoutTypes'),
    };

    // Save to profile
    if (user) {
      await updateProfile(data);
    }

    nav("/dashboard")
    setShowGetStartedModal(false)
  }

  const handleSignIn = () => {
    openSignUp(); 
  }

  return (
    <div>
      {/* Get Started Modal */}
      {showGetStartedModal && (
        <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md transition-all duration-500">
          <div 
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 dark:border-slate-800 transition-all duration-300"
            style={{ animation: 'modalSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <button
              onClick={() => setShowGetStartedModal(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all hover:rotate-90"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>

            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                <i className="ri-rocket-2-fill text-emerald-600 dark:text-emerald-400 text-4xl"></i>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                Your AI Journey Starts Here
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
                Connect with our AI engine to transform your training with real-time feedback.
              </p>
            </div>

            {!user ? (
              <div className="text-center py-10 bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl border border-emerald-100 dark:border-emerald-800/30">
                <p className="text-gray-700 dark:text-emerald-200/70 mb-8 px-6 font-medium">Create your account to unlock personalized AI tracking and progress insights.</p>
                <button
                  onClick={handleSignIn}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transform hover:-translate-y-1 active:scale-95 transition-all duration-300"
                >
                  Join FitVision AI
                </button>
                <div className="mt-8 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    Secured by Clerk
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleStartTraining} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">First Name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      defaultValue={user.first_name || user.full_name?.split(' ')[0]}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none text-gray-900 dark:text-white font-medium transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      defaultValue={user.last_name || (user.full_name?.split(' ').length > 1 ? user.full_name?.split(' ')[1] : '')}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none text-gray-900 dark:text-white font-medium transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="mb-2 ml-1">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider" id="workoutTypes-label">
                      Select Exercises To Start With
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'squat', label: 'Squats', icon: 'ri-walk-line', desc: 'Legs & Glutes' },
                      { id: 'pushup', label: 'Push-ups', icon: 'ri-arrow-down-circle-line', desc: 'Chest & Triceps' },
                      { id: 'curl', label: 'Bicep Curls', icon: 'ri-boxing-line', desc: 'Biceps' },
                      { id: 'shoulder_press', label: 'Shoulder Press', icon: 'ri-arrow-up-circle-line', desc: 'Shoulders' }
                    ].map((type) => (
                      <label 
                        key={type.id} 
                        className="group relative flex items-center p-5 bg-gray-50 dark:bg-slate-800 rounded-2xl cursor-pointer border-2 border-transparent hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-400/5 transition-all duration-300"
                      >
                        <input type="checkbox" name="workoutTypes" value={type.id} className="peer hidden" aria-label={type.label} />
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 dark:text-white">{type.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{type.desc}</div>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-slate-600 flex items-center justify-center peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all">
                          <i className="ri-check-line text-white text-sm scale-0 peer-checked:scale-100 transition-transform"></i>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGetStartedModal(false)}
                    className="flex-1 px-8 py-4 text-gray-500 dark:text-gray-400 font-bold hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Not now
                  </button>
                  <button
                    type="submit"
                    className="flex-[1.5] relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transform hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 group"
                  >
                    <span>INITIALIZE TRAINING</span>
                    <i className="ri-arrow-right-line text-xl group-hover:translate-x-1 transition-transform"></i>
                  </button>
                </div>
              </form>
            )}

            <style>{`
              @keyframes modalSlideUp {
                from { opacity: 0; transform: translateY(40px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  )
}


export default Getstarted

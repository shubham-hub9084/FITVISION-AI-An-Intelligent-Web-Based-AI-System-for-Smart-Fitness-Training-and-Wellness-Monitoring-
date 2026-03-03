import React, { useEffect } from 'react'
import 'remixicon/fonts/remixicon.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import backgroundImage from '../../assets/Background_Img.png'





const HeroSection = ({ setShowGetStartedModal }) => {


  const handleGetStarted = () => {
    setShowGetStartedModal(true)
  }

  const setIsVideoPlaying = () => {
    alert('Demo video feature coming soon!')
  }

  return (
    <div>
      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden min-h-screen flex items-center transition-colors duration-300">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt="AI Fitness Training"
            className="w-full h-full object-cover object-center opacity-1 dark:opacity-40 transition-opacity duration-1000"
            data-aos="fade-in"
          />
          {/* Professional Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent dark:from-slate-900/95 dark:via-slate-900/70 dark:to-slate-900/30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left Section - Content */}
            <div className="text-left flex flex-col justify-center relative z-10" data-aos="fade-up">

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 dark:text-white leading-tight mb-6 transition-colors duration-300 tracking-tight">
                Your AI Powered <br />
                <span className="text-emerald-600 dark:text-emerald-400 block mt-2">
                  Personal Trainer
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed max-w-xl font-medium relative z-10">
                Transform your fitness journey with <span className="text-slate-900 dark:text-white font-bold">intelligent pose correction</span>, personalized workouts, and real-time feedback.
              </p>

              {/* CTA Buttons - Solid Colors */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mb-12 justify-start">
                <button
                  onClick={handleGetStarted}
                  className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center sm:justify-start gap-2"
                  data-aos="zoom-in"
                >
                  <i className="ri-run-line text-xl group-hover:animate-bounce"></i>
                  Start Training Now
                </button>
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="group bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-600 dark:hover:border-emerald-500 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 px-8 py-4 rounded-xl text-lg font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center sm:justify-start gap-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  data-aos="zoom-in"
                  data-aos-delay="150"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                    <i className="ri-play-fill text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 text-lg ml-0.5"></i>
                  </div>
                  Watch Demo
                </button>
              </div>

              {/* Features Grid - Clean & Crisp */}
            </div>
            <div className="hidden lg:block relative" data-aos="fade-left">
              {/* Space reserved for future 3D model or illustration */}
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}


export default HeroSection

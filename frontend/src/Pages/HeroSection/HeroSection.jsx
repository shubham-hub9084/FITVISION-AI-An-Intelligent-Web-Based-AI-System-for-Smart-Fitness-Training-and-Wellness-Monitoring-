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

        {/* Advanced Ambient Background Mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 dark:bg-emerald-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse-soft"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/20 dark:bg-cyan-500/10 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Section - Content */}
            <div className="lg:col-span-7 text-left flex flex-col justify-center relative z-10" data-aos="fade-up">

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tighter">
                Your AI Powered <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 block mt-2">
                  Personal Trainer
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl font-medium relative z-10">
                Transform your fitness journey with <span className="text-slate-900 dark:text-white font-bold">intelligent pose correction</span>, personalized workouts, and real-time biomechanical feedback.
              </p>

              {/* CTA Buttons - Premium Styled */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mb-12 justify-start">
                <button
                  onClick={handleGetStarted}
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center sm:justify-start gap-3"
                  data-aos="zoom-in"
                >
                  <span>Start Training Now</span>
                  <i className="ri-arrow-right-line text-xl group-hover:translate-x-1 transition-transform"></i>
                </button>
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 text-slate-800 dark:text-white px-8 py-4 rounded-xl text-lg font-bold shadow-md hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center sm:justify-start gap-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  data-aos="zoom-in"
                  data-aos-delay="150"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                    <i className="ri-play-fill text-emerald-600 dark:text-emerald-400 text-lg ml-0.5"></i>
                  </div>
                  Watch Demo
                </button>
              </div>



            </div>

            {/* Right Section - Space reserved for future content */}
            <div className="hidden lg:block lg:col-span-5 relative" data-aos="fade-left">
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}


export default HeroSection

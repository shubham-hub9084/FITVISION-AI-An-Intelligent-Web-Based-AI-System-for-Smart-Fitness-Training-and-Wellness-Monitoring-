import React, { useEffect } from 'react'
import 'remixicon/fonts/remixicon.css'
import AOS from 'aos'
import 'aos/dist/aos.css'

const HowItWorks = () => {


  return (
    <div>
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12 sm:mb-16" data-aos="fade-down">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Get started with FitVision AI in just a few simple steps and transform your fitness routine today.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[{
              color: 'emerald',
              step: '1',
              title: 'Sign Up & Set Goals',
              desc: 'Create your account and tell us about your fitness goals, experience level, and preferences.'
            }, {
              color: 'blue',
              step: '2',
              title: 'Camera Setup',
              desc: 'Position your camera and let our AI calibrate to your space for optimal pose detection.'
            }, {
              color: 'purple',
              step: '3',
              title: 'Start Training',
              desc: 'Follow along with personalized workouts while AI provides real-time form corrections.'
            }, {
              color: 'orange',
              step: '4',
              title: 'Track Progress',
              desc: 'Monitor your improvements, celebrate achievements, and adjust your plan as you progress.'
            }].map(({ step, title, desc, color }, index) => (
              <div key={step} className="text-center" data-aos="fade-up" data-aos-delay={index * 150}>
                <div className={`w-16 h-16 sm:w-20 sm:h-20 ${color === 'emerald' ? 'bg-emerald-600' :
                  color === 'blue' ? 'bg-blue-600' :
                    color === 'purple' ? 'bg-purple-600' :
                      'bg-orange-600'
                  } rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg`}>
                  <span className="text-white text-xl sm:text-2xl font-bold">{step}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks

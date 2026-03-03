import React from 'react'
import 'remixicon/fonts/remixicon.css'
import AOS from 'aos'
import 'aos/dist/aos.css'

const features = [
    {
        icon: 'ri-focus-3-line',
        title: 'AI Pose Correction',
        description: 'Real-time form analysis\nand instant feedback',
    },
    {
        icon: 'ri-bar-chart-line',
        title: 'Progress Tracking',
        description: 'Comprehensive analytics\nand performance insights',
    },
    {
        icon: 'ri-restaurant-line',
        title: 'Nutrition Guidance',
        description: 'Personalized meal plans\nand supplement advice',
    },
    {
        icon: 'ri-shield-check-line',
        title: 'Injury Prevention',
        description: 'Smart safety monitoring\nand posture alerts',
    }
]

const KeyBenefits = () => {
    return (
        <section className="py-8 sm:py-12 -mt-16 sm:-mt-24 relative z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                    <div key={index}
                        className="flex flex-col items-start p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-3 mb-4 group-hover:bg-emerald-600 transition-colors duration-300">
                            <i className={`${feature.icon} text-emerald-600 dark:text-emerald-400 group-hover:text-white text-2xl transition-colors duration-300`} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed font-medium">{feature.description.replace('\n', ' ')}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default KeyBenefits

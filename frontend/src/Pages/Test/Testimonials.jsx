import React from 'react';
import sakshiImg from "../../assets/Sakshi_srivastava.jpg";
import sarikaImg from "../../assets/sarika_vish.jpg";
import shubhamImg from "../../assets/Shubham_sahu.jpg";
import sumitImg from "../../assets/sumit_saini.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sumit Saini',
      role: 'Fitness Enthusiast',
      image: sumitImg,
      quote:
        'FitVision AI transformed my home workouts. The real-time corrections helped me perfect my form and avoid injuries.',
    },
    {
      name: 'Shubham Sahu',
      role: 'Busy Professional',
      image: shubhamImg,
      quote:
        'As someone with a hectic schedule, FitVision AI gives me efficient, personalized workouts that fit my lifestyle.',
    },
    {
      name: 'Saraika Vishvkarma',
      role: 'Beginner',
      image: sarikaImg,
      quote:
        'Starting my fitness journey was intimidating, but FitVision AI made it approachable and fun with gamification features.',
    },
    {
      name: 'Sakshi Srivastava',
      role: 'Yoga Practitioner',
      image: sakshiImg,
      quote:
        'The posture analysis is incredible. It really helps me maintain alignment in my yoga practice.',
    },
  ];

  // ✅ Add handler functions
  const handleGetStarted = () => {
    alert('Redirecting to personalized plan...');
  };

  const handleNavigate = () => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = '/dashboard';
    } else {
      alert('Please sign in to start your free trial');
    }
  };

  return (
    <div>
      {/* ✅ Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-20 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Success Stories
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join thousands of users who have transformed their fitness journey
              with FitVision AI.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group h-full flex flex-col"
              >
                {/* Decorative Quote Icon Background */}
                <div className="absolute top-4 right-4 text-gray-100 dark:text-slate-700 group-hover:text-emerald-50 dark:group-hover:text-emerald-900/20 transition-colors duration-300">
                  <i className="ri-double-quotes-r text-6xl opacity-50"></i>
                </div>

                <div className="flex items-center mb-6 relative z-10">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={`${testimonial.name}, ${testimonial.role}`}
                      className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-slate-200 dark:border-slate-600 group-hover:border-emerald-500 transition-colors duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight">
                      {testimonial.name}
                    </h4>
                    <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-wide uppercase mt-0.5">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <div className="flex-grow relative z-10">
                  <div className="flex text-yellow-500 mb-3 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className="ri-star-fill mr-0.5"
                      ></i>
                    ))}
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="bg-emerald-600 rounded-2xl p-8 sm:p-12 text-white">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Ready to Transform Your Fitness?
              </h3>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90">
                Join over 50,000 users who trust FitVision AI for their fitness
                journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleNavigate}
                  className="bg-white text-emerald-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={handleGetStarted}
                  className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Get Your Personalized Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;

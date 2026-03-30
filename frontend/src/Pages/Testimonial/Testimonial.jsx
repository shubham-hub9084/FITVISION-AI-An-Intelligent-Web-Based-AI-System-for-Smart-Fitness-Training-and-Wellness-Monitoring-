import React from 'react';
import { motion } from 'framer-motion';

import sakshiImg from '../../assets/Sakshi_srivastava.jpg';
import shubhamImg from '../../assets/Shubham_sahu.jpg';
import sarikaImg from '../../assets/sarika_vish.jpg';
import sumitImg from '../../assets/sumit_saini.jpg';

const testimonials = [
  {
    id: 1,
    name: "Sakshi Srivastava",
    role: "Fitness Enthusiast",
    image: sakshiImg,
    text: "FitVision AI completely transformed my workout routine. The personalized plans are incredible and easy to follow. I've never felt better!",
    rating: 5,
  },
  {
    id: 2,
    name: "Shubham Sahu",
    role: "Marathon Runner",
    image: shubhamImg,
    text: "As an athlete, I need precision. This app provides accurate calorie tracking and meal suggestions that perfectly complement my training.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sarika Vish",
    role: "Busy Professional",
    image: sarikaImg,
    text: "I used to struggle finding time for fitness. The AI workouts fit perfectly into my schedule and actually show results. Highly recommended!",
    rating: 5,
  },
  {
    id: 4,
    name: "Sumit Saini",
    role: "Gym Beginner",
    image: sumitImg,
    text: "Starting out was intimidating, but this app guided me step-by-step. The AI recommendations are spot on and kept me motivated every day.",
    rating: 5,
  }
];

const Testimonial = () => {
  return (
    <section id="testimonials" className="py-16 sm:py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            What Our Users Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Join thousands of people who have already transformed their lives with our AI-powered fitness trainer.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-700"
            >
              <div className="flex text-yellow-400 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <i key={i} className="ri-star-fill text-xl"></i>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;

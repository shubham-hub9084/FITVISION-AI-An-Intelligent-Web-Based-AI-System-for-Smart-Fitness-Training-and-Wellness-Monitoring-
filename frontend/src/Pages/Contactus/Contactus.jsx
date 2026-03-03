import React from 'react'

const Contactus = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // TODO: Implement actual form submission to backend
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
  };

  return (
    <div>
      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Have questions about FitVision AI? We're here to help you start your fitness transformation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Contact Information</h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-mail-line text-emerald-600 dark:text-emerald-400 text-lg sm:text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Email Support</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">support@fitvision-ai.com</p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm">We typically respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-phone-line text-emerald-600 dark:text-emerald-400 text-lg sm:text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Phone Support</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">+91 6969696996</p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-chat-3-line text-emerald-600 dark:text-emerald-400 text-lg sm:text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Live Chat</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Available 24/7 in the app</p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm">Instant support for urgent questions</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                    <i className="ri-instagram-line text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                    <i className="ri-youtube-line text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                    <i className="ri-linkedin-line text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                    <i className="ri-twitter-line text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 sm:p-8 transition-colors duration-300">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                      placeholder="Shubham"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                      placeholder="sahu"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                    placeholder="shubham@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                    placeholder="How can we help you?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm resize-none"
                    placeholder="Tell us about your fitness goals or questions..."
                    maxLength={500}
                  ></textarea>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum 500 characters</p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contactus

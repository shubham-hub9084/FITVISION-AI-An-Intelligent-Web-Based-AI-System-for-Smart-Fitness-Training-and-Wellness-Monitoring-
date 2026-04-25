import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-scroll";
import Logo from "../../components/Logo";

const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="relative bg-slate-900 border-t border-slate-800 text-white py-16 overflow-hidden font-sans">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 mb-16">
          {/* 1. Brand Section */}
          <div className="space-y-6" data-aos="fade-up">
            <Link to="home" smooth={true} duration={500} className="inline-block cursor-pointer">
              <Logo className="text-white" />
            </Link>
            <p className="text-gray-200 text-sm leading-relaxed max-w-xs">
              Empowering your fitness journey with next-gen AI technology. Real-time form correction and data-driven insights.
            </p>

            <div className="flex gap-4">
              {['github', 'linkedin'].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-gray-200 hover:bg-emerald-500 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  aria-label={social}
                >
                  <i className={`ri-${social}-line text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* 2. Platform Links */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h4 className="text-white font-semibold text-lg mb-6 tracking-tight">Platform</h4>
            <ul className="grid grid-cols-1 gap-4 text-sm font-medium">
              <li>
                <Link to="features" smooth={true} duration={500} className="hover:text-emerald-400 transition-all cursor-pointer">
                  AI Features
                </Link>
              </li>
              <li>
                <Link to="how-it-works" smooth={true} duration={500} className="hover:text-emerald-400 transition-all cursor-pointer">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="testimonials" smooth={true} duration={500} className="hover:text-emerald-400 transition-all cursor-pointer">
                  User Reviews
                </Link>
              </li>
              <li>
                <Link to="contact" smooth={true} duration={500} className="hover:text-emerald-400 transition-all cursor-pointer">
                  Get In Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Newsletter */}
          <div data-aos="fade-up" data-aos-delay="200">
            <h4 className="text-white font-semibold text-lg mb-6">Stay Updated</h4>
            <p className="text-gray-200 text-sm mb-4">Join our community for the latest AI fitness tips and model updates.</p>
            <form className="relative" onSubmit={handleSubscribe}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-400"
              />
              <button
                type="submit"
                className={`absolute right-1.5 top-1.5 p-1.5 rounded-md transition-all ${subscribed ? 'bg-emerald-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                aria-label="Subscribe"
              >
                <i className={`${subscribed ? 'ri-check-line' : 'ri-arrow-right-line'} text-lg`}></i>
              </button>
            </form>
            {subscribed && (
              <p className="text-emerald-400 text-xs mt-3 animate-pulse font-medium">
                Thank you! You've been added to the waitlist.
              </p>
            )}

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-300 text-sm text-center md:text-left">
            © {new Date().getFullYear()} FitVision AI. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;

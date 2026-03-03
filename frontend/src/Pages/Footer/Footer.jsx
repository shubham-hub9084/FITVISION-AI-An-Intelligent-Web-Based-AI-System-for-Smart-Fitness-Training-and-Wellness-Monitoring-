import React, { useEffect } from "react";
import "remixicon/fonts/remixicon.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-scroll";
import Logo from "../../components/Logo";

const Footer = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <footer className="relative bg-slate-900 border-t border-slate-800 text-slate-300 py-16 overflow-hidden font-sans">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* 1. Brand Section */}
          <div className="space-y-6" data-aos="fade-up">
            <Link to="home" smooth={true} duration={500} className="inline-block cursor-pointer">
              <Logo className="text-white" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Empowering your fitness journey with next-gen AI technology. Real-time form correction, personalized plans, and data-driven insights.
            </p>
            <div className="flex gap-4">
              {['twitter-x', 'github', 'discord', 'linkedin'].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  aria-label={social}
                >
                  <i className={`ri-${social}-line text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h4 className="text-white font-semibold text-lg mb-6">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="features" smooth={true} duration={500} className="hover:text-emerald-400 transition-colors cursor-pointer block w-fit">Features</Link></li>
              <li><Link to="how-it-works" smooth={true} duration={500} className="hover:text-emerald-400 transition-colors cursor-pointer block w-fit">How it Works</Link></li>
              <li><Link to="pricing" smooth={true} duration={500} className="hover:text-emerald-400 transition-colors cursor-pointer block w-fit">Pricing</Link></li>
              <li><Link to="testimonials" smooth={true} duration={500} className="hover:text-emerald-400 transition-colors cursor-pointer block w-fit">Success Stories</Link></li>
            </ul>
          </div>

          {/* 3. Resources */}
          <div data-aos="fade-up" data-aos-delay="200">
            <h4 className="text-white font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition-colors block w-fit">Help Center</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors block w-fit">API Documentation</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors block w-fit">System Status</a></li>
              <li><Link to="contact" smooth={true} duration={500} className="hover:text-emerald-400 transition-colors cursor-pointer block w-fit">Contact Us</Link></li>
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div data-aos="fade-up" data-aos-delay="300">
            <h4 className="text-white font-semibold text-lg mb-6">Stay Updated</h4>
            <p className="text-slate-400 text-sm mb-4">Subscribe to our newsletter for the latest AI fitness tips and updates.</p>
            <form className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-500"
              />
              <button
                type="button"
                className="absolute right-1.5 top-1.5 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
                aria-label="Subscribe"
              >
                <i className="ri-arrow-right-line text-lg"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} FitVision AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

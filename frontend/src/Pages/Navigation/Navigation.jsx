import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from '../../components/Logo';
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const menuLinks = [
  { name: "Home", to: "home" },
  { name: "Features", to: "features" },
  { name: "How It Works", to: "how-it-works" },
  { name: "Pricing", to: "pricing" },
  { name: "Reviews", to: "testimonials" },
  { name: "Contact", to: "contact" },
];

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, login, logout, openSignUp } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleStartFreeTrial = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      openSignUp();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isLoggedIn = !!user;

  return (
    <nav
      className="fixed top-0 w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-gray-100/50 dark:border-slate-800/50 py-2 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center">
            <Logo to="/" className="text-4xl drop-shadow-sm text-slate-900 dark:text-white" />
          </div>

          {/* Desktop Menu */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden lg:flex lg:space-x-8"
          >
            {menuLinks.map(({ name, to }) => (
              <ScrollLink
                key={to}
                to={to}
                smooth={true}
                duration={500}
                className="px-3 py-2 text-sm font-medium cursor-pointer transition-all duration-300 text-gray-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400"
                activeClass="text-emerald-700 dark:text-emerald-400 font-semibold"
                spy={true}
                offset={-80}
              >
                {name}
              </ScrollLink>
            ))}
          </motion.div>


          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <FiSun size={20} className="text-yellow-400" /> : <FiMoon size={20} className="text-slate-600" />}
            </button>

            {isLoggedIn ? (
              <>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium transition-colors text-gray-800 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400"
                >
                  Logout
                </button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/dashboard")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-emerald-500/30 transition-all"
                >
                  Dashboard
                </motion.button>
              </>
            ) : (
              <>
                <button
                  onClick={() => login()}
                  className="hidden sm:inline px-3 py-2 text-sm font-medium transition-colors text-gray-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Sign In
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartFreeTrial}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-emerald-500/30 transition-all"
                >
                  Start Free Trial
                </motion.button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <FiX size={24} aria-hidden="true" /> : <FiMenu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-100 dark:border-slate-800 shadow-xl absolute w-full"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {menuLinks.map(({ name, to }, idx) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ScrollLink
                    to={to}
                    smooth={true}
                    duration={500}
                    className="block text-gray-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 px-4 py-3 rounded-xl text-base font-medium cursor-pointer transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {name}
                  </ScrollLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;

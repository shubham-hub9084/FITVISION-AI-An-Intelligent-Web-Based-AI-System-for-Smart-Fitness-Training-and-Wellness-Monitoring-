import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from "react-scroll";
import Logo from './Logo';
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, login } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleSignOut = () => {
        logout();
        navigate("/");
    };

    const isHomePage = location.pathname === '/';

    // Links for the Landing Page (Scroll)
    const landingLinks = [
        { name: "Home", to: "home", type: "scroll" },
        { name: "Features", to: "features", type: "scroll" },
        { name: "How It Works", to: "how-it-works", type: "scroll" },
        { name: "Pricing", to: "pricing", type: "scroll" },
        { name: "Reviews", to: "testimonials", type: "scroll" },
        { name: "Contact", to: "contact", type: "scroll" },
    ];

    // Links for the App/Dashboard (Router)
    const appLinks = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Workouts", path: "/workouts" },
        { name: "Meal Plans", path: "/meal-plans" },
        { name: "Calories Calculator", path: "/calories-calculator" },
        { name: "BMI Calculator", path: "/bmi-calculator" },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-slate-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Logo to="/" className="text-slate-900 dark:text-white" />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {isHomePage ? (
                            // Landing Page Links (Scroll)
                            landingLinks.map((link) => (
                                <ScrollLink
                                    key={link.to}
                                    to={link.to}
                                    smooth={true}
                                    duration={1000}
                                    offset={-70}
                                    className="px-3 py-2 text-sm font-medium cursor-pointer transition-colors text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-md"
                                    activeClass="text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/10"
                                    spy={true}
                                >
                                    {link.name}
                                </ScrollLink>
                            ))
                        ) : (
                            // App Links (Router)
                            appLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-3 py-2 text-sm font-medium transition-colors rounded-md ${isActive
                                            ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400"
                                            : "text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <i className="ri-sun-line text-xl text-yellow-400"></i> : <i className="ri-moon-line text-xl"></i>}
                        </button>

                        {/* Show Dashboard Button if on Home Page and Logged In */}
                        {isHomePage && user && (
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="hidden sm:block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-full transition-colors shadow-sm shadow-emerald-200 dark:shadow-none"
                            >
                                Dashboard
                            </button>
                        )}

                        {/* Sign In Button if NOT Logged In */}
                        {!user && (
                            <button
                                onClick={() => login()}
                                className="px-5 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-sm text-sm"
                            >
                                Sign In
                            </button>
                        )}


                        {/* User Menu */}
                        {user && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors ring-2 ring-transparent focus:ring-emerald-200 overflow-hidden bg-emerald-600 hover:bg-emerald-700"
                                >
                                    {user?.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt={user.full_name || "User Profile"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white text-sm font-semibold">
                                            {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                                        </span>
                                    )}
                                </button>

                                {/* Dropdown */}
                                {isUserMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        ></div>
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 py-2 z-50 transform origin-top-right transition-all">
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.full_name || 'User'}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || 'email@example.com'}</p>
                                            </div>

                                            <div className="py-1">
                                                <button
                                                    onClick={() => {
                                                        navigate('/profile');
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors"
                                                >
                                                    <i className="ri-user-line text-gray-400 dark:text-gray-500 text-lg"></i>
                                                    Profile Settings
                                                </button>
                                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                                                    <i className="ri-settings-line text-gray-400 dark:text-gray-500 text-lg"></i>
                                                    Preferences
                                                </button>
                                                {!isHomePage && (
                                                    <button
                                                        onClick={() => navigate('/')}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors"
                                                    >
                                                        <i className="ri-home-line text-gray-400 dark:text-gray-500 text-lg"></i>
                                                        Back to Home
                                                    </button>
                                                )}
                                            </div>

                                            <div className="border-t border-gray-100 dark:border-slate-700 mt-1 pt-1">
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-3 transition-colors"
                                                >
                                                    <i className="ri-logout-box-line text-red-500 text-lg"></i>
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <i className={`text-2xl ${isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shadow-lg absolute w-full left-0 z-40">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        {isHomePage ? (
                            <>
                                {/* Logged in user dashboard link on home page mobile menu */}
                                {user && (
                                    <button
                                        onClick={() => {
                                            navigate("/dashboard");
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-colors text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 cursor-pointer mb-2"
                                    >
                                        Dashboard
                                    </button>
                                )}

                                {landingLinks.map((link) => (
                                    <ScrollLink
                                        key={link.to}
                                        to={link.to}
                                        smooth={true}
                                        duration={1000}
                                        offset={-70}
                                        className="block px-3 py-3 rounded-lg text-base font-medium transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </ScrollLink>
                                ))}
                            </>
                        ) : (
                            appLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `block px-3 py-3 rounded-lg text-base font-medium transition-colors ${isActive
                                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400"
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))
                        )}
                        {!user && (
                            <button
                                onClick={() => login()}
                                className="block w-full text-center px-3 py-3 mt-4 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

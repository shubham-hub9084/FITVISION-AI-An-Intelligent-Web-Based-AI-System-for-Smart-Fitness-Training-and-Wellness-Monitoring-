import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />
            <motion.main
                className="dark:bg-slate-900 pt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <Outlet />
            </motion.main>
        </div>
    );
};

export default Layout;

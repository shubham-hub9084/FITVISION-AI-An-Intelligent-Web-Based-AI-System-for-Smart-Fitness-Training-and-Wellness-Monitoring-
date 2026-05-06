import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ className = '', onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold mb-6 group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl shadow-sm hover:shadow-md hover:shadow-emerald-500/10 hover:border-emerald-500/30 active:scale-95 transition-all duration-300 ${className}`}
        >
            <i className="ri-arrow-left-line text-xl mr-2 transform group-hover:-translate-x-1 transition-transform"></i>
            Back
        </button>
    );
};

export default BackButton;

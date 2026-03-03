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
            className={`flex items-center text-gray-600 hover:text-emerald-600 transition-colors font-medium mb-4 group ${className}`}
        >
            <i className="ri-arrow-left-line text-xl mr-2 transform group-hover:-translate-x-1 transition-transform"></i>
            Back
        </button>
    );
};

export default BackButton;

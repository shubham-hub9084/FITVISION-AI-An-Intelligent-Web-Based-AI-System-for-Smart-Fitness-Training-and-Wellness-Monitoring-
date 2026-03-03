import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logo({ to = '/', className = '', children }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className={`group flex items-center gap-1.5 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
      style={{ fontFamily: '"Outfit", sans-serif' }}
      aria-label="Go to home"
    >
      {children ? children : (
        <div className="flex items-center">
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight transition-colors">
            fitvision
          </span>
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent ml-1 drop-shadow-sm group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-300">
            ai
          </span>
        </div>
      )}
    </button>
  );
}

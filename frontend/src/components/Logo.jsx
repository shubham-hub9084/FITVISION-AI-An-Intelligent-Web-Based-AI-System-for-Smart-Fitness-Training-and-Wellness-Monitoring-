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
        <div className="flex items-center tracking-tighter">
          <span className="text-2xl md:text-3xl font-light uppercase transition-colors">
            FIT
          </span>
          <span className="text-2xl md:text-3xl font-black uppercase transition-colors">
            VISION
          </span>
          <span className="ml-1.5 text-2xl md:text-3xl font-black uppercase bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-300">
            AI
          </span>
        </div>
    </button>
  );
}

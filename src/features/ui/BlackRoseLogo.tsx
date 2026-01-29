import React from 'react';

export const BlackRoseLogo: React.FC = () => {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center glow-box rounded-full bg-black/50">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(74,14,92,0.8)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Filigree Ring */}
        <circle cx="50" cy="50" r="48" stroke="#332a33" strokeWidth="1" opacity="0.5" />
        <path d="M50 2 A48 48 0 0 1 98 50" stroke="#4a0e5c" strokeWidth="0.5" strokeDasharray="4 2" />
        <path d="M50 98 A48 48 0 0 1 2 50" stroke="#4a0e5c" strokeWidth="0.5" strokeDasharray="4 2" />

        {/* Tracery / Thorns */}
        <path d="M50 85 Q 60 70 75 75 T 85 50" stroke="#1a1412" strokeWidth="2" fill="none" />
        <path d="M50 85 Q 40 70 25 75 T 15 50" stroke="#1a1412" strokeWidth="2" fill="none" />

        {/* The Black Rose Petals */}
        <g className="animate-pulse">
            {/* Base Petals */}
            <path d="M50 60 C 20 60 20 30 50 30 C 80 30 80 60 50 60 Z" fill="#050005" stroke="#2a0a2a" strokeWidth="1" />

            {/* Inner Layers */}
            <path d="M50 55 C 30 55 30 35 50 35 C 70 35 70 55 50 55 Z" fill="#0e020e" stroke="#4a0e5c" strokeWidth="0.5" />
            <path d="M50 50 C 40 50 40 40 50 40 C 60 40 60 50 50 50 Z" fill="#1a0520" />

            {/* Highlight Spline */}
            <path d="M50 32 Q 60 32 55 40" stroke="#4a0e5c" strokeWidth="0.5" opacity="0.6" />
        </g>

        {/* Central Core */}
        <circle cx="50" cy="45" r="2" fill="#c0b283" className="animate-ping" opacity="0.5" />

      </svg>

      {/* Glow Overlay */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none" 
        style={{ background: 'radial-gradient(circle, rgba(74,14,92,0.2) 0%, transparent 70%)' }}
      />
    </div>
  );
};

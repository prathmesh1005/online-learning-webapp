'use client';

import React, { useEffect } from 'react';

const DarkBackground = ({ onLoad, className = '', style = {} }) => {
  useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  return (
    <div
      className={`dark-bg ${className}`}
      style={{ ...style }}
      aria-hidden
    >
      <div className="gradient-overlay" />
      <div className="particle-grid" />

      <style jsx>{`
        .dark-bg {
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.85) 100%), linear-gradient(180deg, #000000 0%, #0b0b0c 100%);
          position: relative;
          overflow: hidden;
        }

        .gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(236,72,153,0.03), rgba(139,92,246,0.02) 25%, rgba(6,182,212,0.01) 60%, transparent 100%);
          mix-blend-mode: overlay;
          pointer-events: none;
        }

        .particle-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.06;
          transform: translateZ(0);
          will-change: opacity, transform;
        }

        /* subtle movement */
        @keyframes drift {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-6px) translateX(4px); }
          100% { transform: translateY(0px) translateX(0px); }
        }

        .particle-grid {
          animation: drift 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DarkBackground;

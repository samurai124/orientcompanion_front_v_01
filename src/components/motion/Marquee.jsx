import React from 'react';
import { useReducedMotion } from 'motion/react';

export function Marquee({
  children,
  speed = 32,
  pauseOnHover = true,
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={`flex flex-wrap gap-6 overflow-x-auto ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`group relative flex overflow-hidden select-none ${className}`}
      style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)' }}
    >
      <div
        className={`flex min-w-full shrink-0 items-center justify-around gap-10 animate-[marquee_var(--speed)_linear_infinite] ${
          pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''
        }`}
        style={{ '--speed': `${speed}s` }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`flex min-w-full shrink-0 items-center justify-around gap-10 animate-[marquee_var(--speed)_linear_infinite] ${
          pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''
        }`}
        style={{ '--speed': `${speed}s` }}
      >
        {children}
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}

export default Marquee;

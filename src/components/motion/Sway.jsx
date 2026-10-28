import React from 'react';
import { useReducedMotion } from 'motion/react';

export function Sway({
  children,
  className = '',
  origin = 'bottom center',
  duration = 6,
  style = {},
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`${shouldReduceMotion ? '' : 'animate-sway'} ${className}`}
      style={{
        transformOrigin: origin,
        animationDuration: `${duration}s`,
        willChange: shouldReduceMotion ? 'auto' : 'transform',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default Sway;

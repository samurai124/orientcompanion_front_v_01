import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export function AnimatedProgress({
  value = 0,
  max = 100,
  duration = 0.8,
  delay = 0.1,
  className = '',
  barClassName = '',
}) {
  const shouldReduceMotion = useReducedMotion();
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full bg-lavender-100 ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${percentage}%` }}
        viewport={{ once: true }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration, delay, ease: [0.16, 1, 0.3, 1] }
        }
        className={`h-full rounded-full bg-gradient-to-r from-lavender-600 to-lavender-700 transition-colors ${barClassName}`}
      />
    </div>
  );
}

export default AnimatedProgress;

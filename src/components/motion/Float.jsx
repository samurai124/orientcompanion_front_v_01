import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export function Float({
  children,
  distance = 10,
  rotation = 3,
  duration,
  delay,
  className = '',
  style = {},
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  // Pick deterministic or random values if not provided so multiple instances never sync
  const floatDuration = useMemo(() => {
    return duration || 5.2 + Math.random() * 2.0; // between 5.2s and 7.2s
  }, [duration]);

  const floatDelay = useMemo(() => {
    return delay !== undefined ? delay : Math.random() * 1.5;
  }, [delay]);

  if (shouldReduceMotion) {
    return <div className={className} style={style} {...props}>{children}</div>;
  }

  return (
    <motion.div
      animate={{
        y: [-distance, distance, -distance],
        rotate: [-rotation, rotation, -rotation],
      }}
      transition={{
        duration: floatDuration,
        delay: floatDelay,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      className={className}
      style={{ willChange: 'transform', ...style }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Float;

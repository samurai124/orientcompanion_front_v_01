import React, { useState, useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

export function CountUp({
  to,
  value,
  from = 0,
  duration = 1.2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const targetNumber = Number(value !== undefined ? value : (to !== undefined ? to : 0));
  const [current, setCurrent] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setCurrent(targetNumber);
      return;
    }

    let startTimestamp = null;
    const startVal = Number(from);

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Ease out expo formula
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const nextVal = startVal + (targetNumber - startVal) * easeProgress;

      setCurrent(nextVal);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCurrent(targetNumber);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isInView, targetNumber, from, duration, shouldReduceMotion]);

  const formatted = decimals > 0 ? current.toFixed(decimals) : Math.round(current);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
}

export default CountUp;

import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react';

/**
 * Mouse-move parallax for hero objects (±12px, gentle spring)
 */
export function MouseParallax({
  children,
  strength = 12,
  className = '',
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);

    x.set(mouseX * strength);
    y.set(mouseY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (shouldReduceMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ x: smoothX, y: smoothY, willChange: 'transform' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Scroll parallax for backgrounds / flower field (translateY at ~0.15x scroll speed)
 */
export function ScrollParallax({
  children,
  speed = 0.15,
  className = '',
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-40 * speed * 10, 40 * speed * 10]);

  if (shouldReduceMotion) {
    return <div ref={ref} className={className} {...props}>{children}</div>;
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} {...props}>
      <motion.div className="w-full h-full relative" style={{ y, willChange: 'transform' }}>
        {children}
      </motion.div>
    </div>
  );
}

export default MouseParallax;

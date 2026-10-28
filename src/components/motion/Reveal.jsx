import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  y = 24,
  className = '',
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Custom smooth ease-out
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  staggerDelay = 0.08,
  className = '',
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <div className={className} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        const childClass = child.props.className || '';
        return (
          <Reveal
            key={child.key ?? index}
            delay={index * staggerDelay}
            className={childClass}
          >
            {child}
          </Reveal>
        );
      })}
    </div>
  );
}

export default Reveal;

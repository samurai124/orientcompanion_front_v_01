import React from 'react';
import { VisualImage } from '@/components/design/VisualImage';

export function BentoCard({
  variant = 'plain',
  title,
  subtitle,
  description,
  visual,
  children,
  footer,
  className = '',
  imageClassName = '',
  onClick,
}) {
  // Variant styles matching reference
  const variantStyles = {
    light: 'lavender-card-gradient border border-lavender-200/80 text-ink-dark',
    dark: 'dark-navy-card border border-white/10 text-white',
    plain: 'bg-white border border-border/80 text-ink-dark shadow-2xs',
  };

  const isDark = variant === 'dark';

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-sm ${variantStyles[variant] || variantStyles.plain} ${className}`}
    >
      {/* Top Header */}
      <div className="relative z-10 space-y-2">
        {subtitle && (
          <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-ink-muted'}`}>
            {subtitle}
          </p>
        )}
        {title && (
          <h3 className={`text-xl sm:text-2xl font-normal tracking-tight leading-snug ${isDark ? 'text-white' : 'text-ink-dark'}`}>
            {title}
          </h3>
        )}
      </div>

      {/* Middle Visual or custom content */}
      {visual && (
        <div className="relative my-4 flex items-center justify-center overflow-hidden">
          <VisualImage
            visual={visual}
            className={`object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04] ${imageClassName || 'max-h-48'}`}
          />
        </div>
      )}

      {children && (
        <div className="relative z-10 my-3">
          {children}
        </div>
      )}

      {/* Bottom Text / Footer */}
      {(description || footer) && (
        <div className="relative z-10 mt-auto pt-4 space-y-3">
          {description && (
            <p className={`text-sm leading-relaxed font-normal ${isDark ? 'text-white/75' : 'text-ink-muted'}`}>
              {description}
            </p>
          )}
          {footer && (
            <div className="pt-2">
              {footer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BentoCard;

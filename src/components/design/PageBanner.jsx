import React from 'react';
import { VISUALS } from '@/lib/visuals';
import { VisualImage } from '@/components/design/VisualImage';
import { Float, Reveal } from '@/components/motion';

export function PageBanner({
  title,
  description,
  visual = VISUALS.objCompass,
  badge,
  action,
  children,
  className = '',
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[24px] md:rounded-[28px] lavender-card-gradient border border-lavender-200/80 p-6 sm:p-8 shadow-xs mb-8 ${className}`}
    >
      {/* Decorative blurred soft glow in corner */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/40 blur-2xl rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Title, Badge, Description */}
        <div className="max-w-2xl space-y-2">
          {badge && (
            <div className="inline-block mb-1">
              {React.isValidElement(badge) ? (
                badge
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/80 text-ink-dark border border-white/60 shadow-2xs backdrop-blur-xs">
                  {badge}
                </span>
              )}
            </div>
          )}

          <Reveal>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-ink-dark">
              {title}
            </h1>
          </Reveal>

          {description && (
            <Reveal delay={0.1}>
              <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-normal">
                {description}
              </p>
            </Reveal>
          )}

          {children}
        </div>

        {/* Right: Floating Visual & Action */}
        <div className="flex items-center gap-4 self-start md:self-center shrink-0">
          {action && (
            <div className="relative z-10">
              {action}
            </div>
          )}

          {visual && (
            <div className="hidden sm:block w-24 h-24 md:w-32 md:h-32 relative shrink-0">
              <Float distance={8} duration={5.5}>
                <VisualImage
                  visual={visual}
                  className="w-full h-full object-contain drop-shadow-sm select-none pointer-events-none"
                />
              </Float>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageBanner;

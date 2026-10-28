import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Modern emblem for OrientCompanion:
 * - 4-point faceted Compass Star (Guidance & Direction)
 * - Ascending Trajectory Ribbon (Student Journey & Companionship)
 * - Deep midnight violet squircle with pearl rim lighting
 */
export function LogoIcon({ size = 40, className = '' }) {
  const idPrefix = React.useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 transition-transform duration-200 group-hover:scale-105 select-none', className)}
      aria-hidden="true"
    >
      <defs>
        {/* Jewel Container Gradient */}
        <radialGradient id={`${idPrefix}-badge`} cx="35%" cy="25%" r="85%">
          <stop offset="0%" stopColor="#38305E" />
          <stop offset="55%" stopColor="#201B38" />
          <stop offset="100%" stopColor="#120F24" />
        </radialGradient>

        {/* Facet Light / Pearl */}
        <linearGradient id={`${idPrefix}-facetLight`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#E4E3F5" />
          <stop offset="100%" stopColor="#9B8CF8" />
        </linearGradient>

        {/* Facet Mid Violet */}
        <linearGradient id={`${idPrefix}-facetMid`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#816FF6" />
          <stop offset="100%" stopColor="#5544B8" />
        </linearGradient>

        {/* Facet Dark Violet */}
        <linearGradient id={`${idPrefix}-facetDark`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#433596" />
          <stop offset="100%" stopColor="#241C54" />
        </linearGradient>

        {/* Trajectory Ribbon Gradient */}
        <linearGradient id={`${idPrefix}-trajectory`} x1="10%" y1="90%" x2="90%" y2="10%">
          <stop offset="0%" stopColor="#6B5BD2" stopOpacity="0" />
          <stop offset="50%" stopColor="#A495FA" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
        </linearGradient>

        {/* Outer Rim Hairline */}
        <linearGradient id={`${idPrefix}-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#A9A7E0" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#6B5BD2" stopOpacity="0.3" />
        </linearGradient>

        {/* Ambient Drop Shadow */}
        <filter id={`${idPrefix}-shadow`} x="-15%" y="-15%" width="130%" height="135%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#120F24" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Squircle Badge Container */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="26"
        fill={`url(#${idPrefix}-badge)`}
        stroke={`url(#${idPrefix}-rim)`}
        strokeWidth="1.5"
        filter={`url(#${idPrefix}-shadow)`}
      />

      {/* Subtle ambient inner orbital line */}
      <circle cx="50" cy="50" r="32" stroke="#6B5BD2" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="2 3" />

      {/* Dynamic Ascending Trajectory Arc (Guidance / Academic Journey) */}
      <path
        d="M 28 66 C 22 48, 30 28, 52 24 C 70 20, 80 32, 76 50 C 73 64, 58 76, 40 73"
        stroke={`url(#${idPrefix}-trajectory)`}
        strokeWidth="3.4"
        strokeLinecap="round"
      />

      {/* 4-Point Faceted Compass Star */}
      {/* North Spear */}
      <polygon points="50,22 50,50 43,47" fill={`url(#${idPrefix}-facetLight)`} />
      <polygon points="50,22 57,47 50,50" fill={`url(#${idPrefix}-facetDark)`} />

      {/* South Spear */}
      <polygon points="50,78 50,50 57,53" fill={`url(#${idPrefix}-facetLight)`} />
      <polygon points="50,78 43,53 50,50" fill={`url(#${idPrefix}-facetDark)`} />

      {/* East Spear */}
      <polygon points="78,50 50,50 53,43" fill={`url(#${idPrefix}-facetLight)`} />
      <polygon points="78,50 53,57 50,50" fill={`url(#${idPrefix}-facetMid)`} />

      {/* West Spear */}
      <polygon points="22,50 50,50 47,57" fill={`url(#${idPrefix}-facetMid)`} />
      <polygon points="22,50 47,43 50,50" fill={`url(#${idPrefix}-facetDark)`} />

      {/* Secondary Diagonals (Subtle faceted highlights) */}
      <polygon points="66,34 50,50 54,43" fill={`url(#${idPrefix}-facetLight)`} opacity="0.85" />
      <polygon points="34,66 50,50 43,54" fill={`url(#${idPrefix}-facetDark)`} opacity="0.85" />
      <polygon points="34,34 50,50 43,46" fill={`url(#${idPrefix}-facetMid)`} opacity="0.85" />
      <polygon points="66,66 50,50 54,47" fill={`url(#${idPrefix}-facetMid)`} opacity="0.85" />

      {/* Center Pearl Focal Light */}
      <circle cx="50" cy="50" r="4.2" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="2" fill="#201B38" />
    </svg>
  );
}

/**
 * Full Logo Component (Icon + Typographic Wordmark)
 */
export function Logo({
  size = 'md',
  iconOnly = false,
  showSubtitle = true,
  variant = 'dark',
  className = '',
}) {
  const sizeMap = {
    sm: { icon: 32, text: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 40, text: 'text-base', sub: 'text-[11px]' },
    lg: { icon: 48, text: 'text-lg', sub: 'text-xs' },
    xl: { icon: 60, text: 'text-2xl', sub: 'text-xs' },
  };

  const { icon: iconSize, text: textSize, sub: subSize } = sizeMap[size] || sizeMap.md;

  const textColor = variant === 'light' ? 'text-white' : 'text-neutral-900';
  const subColor = variant === 'light' ? 'text-white/60' : 'text-neutral-500';

  return (
    <div className={cn('flex items-center gap-3 select-none group', className)}>
      <LogoIcon size={iconSize} />

      {!iconOnly && (
        <div className="flex flex-col leading-tight">
          <span className={cn('font-bold tracking-tight', textSize, textColor)}>
            Orient<span className="text-[#6B5BD2]">Companion</span>
          </span>
          {showSubtitle && (
            <span className={cn('font-semibold uppercase tracking-wider', subSize, subColor)}>
              Orientation Maroc
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default Logo;

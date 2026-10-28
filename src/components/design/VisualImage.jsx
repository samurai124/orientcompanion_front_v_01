import React, { useState } from 'react';
import {
  GraduationCap,
  Compass,
  BookOpen,
  Hourglass,
  Trophy,
  Sparkles,
  Building2,
  Flower2,
  Layers,
} from 'lucide-react';

const ICON_MAP = {
  flower: Flower2,
  'graduation-cap': GraduationCap,
  compass: Compass,
  book: BookOpen,
  hourglass: Hourglass,
  trophy: Trophy,
  sparkles: Sparkles,
  building: Building2,
  layers: Layers,
};

/**
 * Resilient Image component:
 * - Lazy loaded with explicit width/height to avoid layout shifts (CLS)
 * - Graceful fallback to a lavender gradient + Lucide icon if file is missing or fails to load
 */
export function VisualImage({
  visual,
  className = '',
  loading = 'lazy',
  fallbackClassName = '',
  style = {},
  ...props
}) {
  const [hasError, setHasError] = useState(false);

  if (!visual || hasError || !visual.src) {
    const FallbackIcon = ICON_MAP[visual?.icon] || Sparkles;
    return (
      <div
        className={`lavender-card-gradient flex items-center justify-center rounded-2xl border border-lavender-200/60 p-6 ${fallbackClassName || className}`}
        style={style}
        role="img"
        aria-label={visual?.alt || "Illustration OrientCompanion"}
      >
        <FallbackIcon className="h-10 w-10 text-lavender-600/70 animate-pulse" />
      </div>
    );
  }

  return (
    <img
      src={visual.src}
      alt={visual.alt}
      width={visual.width}
      height={visual.height}
      loading={loading}
      decoding="async"
      onError={() => setHasError(true)}
      className={className}
      style={style}
      {...props}
    />
  );
}

export default VisualImage;

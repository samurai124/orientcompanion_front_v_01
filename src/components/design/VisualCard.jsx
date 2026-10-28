import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { VisualImage } from '@/components/design/VisualImage';

export function VisualCard({
  title,
  subtitle,
  description,
  linkText = "En savoir plus",
  linkTo,
  onLinkClick,
  visual,
  badge,
  className = '',
  imageClassName = '',
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl bg-white border border-border/80 shadow-2xs flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${className}`}
    >
      {/* Top Content */}
      <div className="relative z-10 p-6 sm:p-8 pb-4 space-y-3">
        {badge && (
          <div className="inline-block">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lavender-100 text-lavender-700">
              {badge}
            </span>
          </div>
        )}

        {subtitle && (
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            {subtitle}
          </p>
        )}

        <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-ink-dark">
          {title}
        </h3>

        {description && (
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-normal">
            {description}
          </p>
        )}

        {/* Small "Learn more" link with sliding arrow */}
        {(linkTo || onLinkClick) && (
          <div className="pt-2">
            {linkTo ? (
              <Link
                to={linkTo}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-ink hover:text-lavender-600 transition-colors group/link"
              >
                <span>{linkText}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={onLinkClick}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-ink hover:text-lavender-600 transition-colors group/link"
              >
                <span>{linkText}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom 3D Visual fading out bottom edge */}
      {visual && (
        <div className="relative w-full mt-4 overflow-hidden pt-4 flex justify-center items-end">
          <VisualImage
            visual={visual}
            className={`w-full max-h-64 object-contain object-bottom transition-transform duration-500 ease-out group-hover:scale-[1.04] select-none pointer-events-none ${imageClassName}`}
          />
          {/* Subtle bottom fade to white */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
}

export default VisualCard;

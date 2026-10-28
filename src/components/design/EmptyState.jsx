import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { VISUALS } from '@/lib/visuals';
import { VisualImage } from '@/components/design/VisualImage';
import { Float } from '@/components/motion';

export function EmptyState({
  title = "Aucune donnée trouvée",
  description = "Il n'y a aucun élément à afficher pour le moment.",
  actionLabel,
  actionTo,
  onAction,
  visual = VISUALS.emptyState,
  className = '',
  children,
}) {
  return (
    <div
      className={`rounded-3xl bg-white border border-border/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto shadow-2xs ${className}`}
    >
      {/* 3D Sprout visual with gentle float */}
      <div className="w-28 h-28 sm:w-36 sm:h-36 mb-6">
        <Float distance={6} duration={5}>
          <VisualImage
            visual={visual}
            className="w-full h-full object-contain select-none pointer-events-none drop-shadow-xs"
          />
        </Float>
      </div>

      <h3 className="text-xl sm:text-2xl font-normal tracking-tight text-ink-dark mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-ink-muted leading-relaxed font-normal mb-6 max-w-sm">
          {description}
        </p>
      )}

      {children}

      {(actionTo || onAction) && actionLabel && (
        <div className="pt-2">
          {actionTo ? (
            <Link
              to={actionTo}
              className="inline-flex items-center gap-2 rounded-full bg-[#1E1B33] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#2A2545] transition-all group shadow-2xs"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 rounded-full bg-[#1E1B33] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#2A2545] transition-all group shadow-2xs"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;

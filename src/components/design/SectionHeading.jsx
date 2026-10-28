import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion';

export function SectionHeading({
  eyebrow,
  title,
  paragraph,
  buttonText,
  buttonTo,
  onButtonClick,
  align = 'split', // 'split' | 'center'
  className = '',
}) {
  if (align === 'center') {
    return (
      <div className={`text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16 ${className}`}>
        {eyebrow && (
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {eyebrow}
            </p>
          </Reveal>
        )}

        <Reveal delay={0.08}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-ink-dark leading-tight">
            {title}
          </h2>
        </Reveal>

        {paragraph && (
          <Reveal delay={0.16}>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-normal max-w-2xl mx-auto">
              {paragraph}
            </p>
          </Reveal>
        )}

        {(buttonTo || onButtonClick) && buttonText && (
          <Reveal delay={0.24}>
            <div className="pt-2">
              {buttonTo ? (
                <Link
                  to={buttonTo}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1E1B33] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#2A2545] transition-all duration-200 group shadow-2xs"
                >
                  <span>{buttonText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onButtonClick}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1E1B33] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#2A2545] transition-all duration-200 group shadow-2xs"
                >
                  <span>{buttonText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </Reveal>
        )}
      </div>
    );
  }

  // 'split' layout matching reference image:
  // Huge heading on the left with pill button below, short paragraph on the right
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12 sm:mb-16 ${className}`}>
      {/* Left Column: Heading + Pill Button */}
      <div className="lg:col-span-7 space-y-6">
        {eyebrow && (
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {eyebrow}
            </p>
          </Reveal>
        )}

        <Reveal delay={0.08}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-ink-dark leading-tight">
            {title}
          </h2>
        </Reveal>

        {(buttonTo || onButtonClick) && buttonText && (
          <Reveal delay={0.18}>
            <div>
              {buttonTo ? (
                <Link
                  to={buttonTo}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1E1B33] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#2A2545] transition-all duration-200 group shadow-2xs"
                >
                  <span>{buttonText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onButtonClick}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1E1B33] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#2A2545] transition-all duration-200 group shadow-2xs"
                >
                  <span>{buttonText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </Reveal>
        )}
      </div>

      {/* Right Column: Short paragraph in muted ink */}
      <div className="lg:col-span-5 lg:pt-2">
        {paragraph && (
          <Reveal delay={0.14}>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-normal">
              {paragraph}
            </p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

export default SectionHeading;

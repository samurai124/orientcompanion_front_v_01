import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkle } from 'lucide-react';
import { VISUALS } from '@/lib/visuals';
import { VisualImage } from '@/components/design/VisualImage';
import { Float, Reveal, MouseParallax } from '@/components/motion';

export function HeroCard({
  title = "Là où votre avenir s'épanouit",
  subtitle = "Une plateforme d'orientation intelligente post-bac, conçue pour vous guider vers les meilleures opportunités académiques au Maroc.",
  cta = { label: "Commencer", to: "/register" },
  image = VISUALS.heroField,
  floatingObjects = [
    { visual: VISUALS.objCap, position: 'bottom-8 sm:bottom-16 left-4 sm:left-12 md:left-20', size: 'w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36', delay: 0 },
    { visual: VISUALS.objCompass, position: 'bottom-10 sm:bottom-20 right-4 sm:right-16 md:right-24', size: 'w-18 h-18 sm:w-24 sm:h-24 md:w-32 md:h-32', delay: 0.8 },
  ],
  children,
  className = '',
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] md:rounded-[32px] lavender-hero-gradient border border-lavender-200/80 shadow-sm ${className}`}
    >
      {/* Decorative subtle background light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-white/40 blur-3xl pointer-events-none rounded-full" />

      {/* Content Top Section */}
      <div className="relative z-20 pt-12 md:pt-16 pb-2 px-6 sm:px-10 text-center max-w-3xl mx-auto flex flex-col items-center">
        {/* Centered small star symbol from reference */}
        <Reveal delay={0.05}>
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/60 text-ink backdrop-blur-sm mb-6 border border-white/80 shadow-xs">
            <Sparkle className="w-4 h-4 fill-ink/10" />
          </div>
        </Reveal>

        {/* Quiet, large, light headline */}
        <Reveal delay={0.15}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-ink-dark leading-[1.1] mb-5">
            {title}
          </h1>
        </Reveal>

        {/* Centered one-sentence subtitle */}
        {subtitle && (
          <Reveal delay={0.25}>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl mx-auto mb-8 font-normal">
              {subtitle}
            </p>
          </Reveal>
        )}

        {/* Pill CTA button with sliding arrow */}
        {cta && (
          <Reveal delay={0.35}>
            {cta.to ? (
              <Link
                to={cta.to}
                className="inline-flex items-center gap-2 rounded-full bg-[#1E1B33] text-white px-7 py-3 text-sm font-medium hover:bg-[#2A2545] transition-all duration-200 group shadow-sm active:scale-95"
              >
                <span>{cta.label}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={cta.onClick}
                className="inline-flex items-center gap-2 rounded-full bg-[#1E1B33] text-white px-7 py-3 text-sm font-medium hover:bg-[#2A2545] transition-all duration-200 group shadow-sm active:scale-95"
              >
                <span>{cta.label}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            )}
          </Reveal>
        )}

        {children}
      </div>

      {/* Hero Bottom Area: Flower field with nestled 3D objects */}
      <div className="relative w-full -mt-6 sm:-mt-8 md:-mt-10 h-[240px] sm:h-[320px] md:h-[400px] lg:h-[460px] overflow-hidden">
        {/* Soft top gradient blend overlay so the image melts seamlessly into the sky */}
        <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-[#E4E3F5] via-[#E4E3F5]/40 to-transparent pointer-events-none z-10" />

        {/* Floating 3D Objects nestled among flowers */}
        {floatingObjects && floatingObjects.length > 0 && (
          <MouseParallax strength={14} className="absolute inset-0 pointer-events-none z-15">
            {floatingObjects.map((obj, idx) => (
              <div key={idx} className={`absolute ${obj.position || 'bottom-10 left-10'}`}>
                <Float delay={obj.delay || idx * 0.5} duration={6} distance={8}>
                  <VisualImage
                    visual={obj.visual}
                    className={`object-contain drop-shadow-lg select-none pointer-events-none ${obj.size || 'w-28 h-28'}`}
                  />
                </Float>
              </div>
            ))}
          </MouseParallax>
        )}

        {/* Full-bleed flower field image */}
        <VisualImage
          visual={image}
          loading="eager"
          className="w-full h-full object-cover object-bottom select-none pointer-events-none"
        />

        {/* Soft bottom vignette overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

export default HeroCard;

import React from 'react';
import { Marquee } from '@/components/motion';

export function TrustStrip({
  caption = "Les établissements et filières d'excellence couverts",
  items = [
    "ENSA MAROC",
    "ENCG",
    "FST",
    "FACULTÉS DE MÉDECINE (FMP/FMD)",
    "IAV HASSAN II",
    "ENSIAS",
    "CPGE MAROC",
    "INPT",
    "EHTP",
    "ISCAE",
    "ENSAM",
    "EST",
  ],
  className = '',
}) {
  return (
    <div
      className={`py-10 border-y border-border/70 flex flex-col md:flex-row items-center gap-6 overflow-hidden ${className}`}
    >
      {/* Caption on Left */}
      <div className="shrink-0 text-xs uppercase tracking-widest text-ink-muted font-medium px-4 text-center md:text-left md:max-w-xs">
        {caption}
      </div>

      {/* Marquee of plain grey wordmarks */}
      <div className="flex-1 w-full overflow-hidden">
        <Marquee speed={36} pauseOnHover={true}>
          {items.map((item, index) => (
            <span
              key={index}
              className="text-sm md:text-base font-light tracking-wider text-ink-muted/80 hover:text-ink transition-colors px-6 whitespace-nowrap select-none"
            >
              {item}
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

export default TrustStrip;

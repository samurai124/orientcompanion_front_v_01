// WebP visual asset imports (resolved by Vite bundler)
import heroFieldSrc from '@/assets/visuals/hero-field.webp';
import objCapSrc from '@/assets/visuals/obj-cap.webp';
import objCompassSrc from '@/assets/visuals/obj-compass.webp';
import objBookSrc from '@/assets/visuals/obj-book.webp';
import objHourglassSrc from '@/assets/visuals/obj-hourglass.webp';
import objTrophySrc from '@/assets/visuals/obj-trophy.webp';
import flowerSproutSrc from '@/assets/visuals/flower-sprout.webp';
import buildingColumnsSrc from '@/assets/visuals/building-columns.webp';
import bgSoftBlobSrc from '@/assets/visuals/bg-soft-blob.webp';
import emptyStateSrc from '@/assets/visuals/empty-state.webp';

/**
 * Single source of truth for all visuals.
 * Allows swapping assets in one place without touching components.
 */
export const VISUALS = {
  heroField: {
    src: heroFieldSrc,
    alt: "Champ de fleurs lavande avec sphères de verre et de perle dans la brume douce",
    width: 2400,
    height: 900,
    icon: 'flower',
  },
  objCap: {
    src: objCapSrc,
    alt: "Toque de diplôme en verre lavande nacré flottant",
    width: 800,
    height: 800,
    icon: 'graduation-cap',
  },
  objCompass: {
    src: objCompassSrc,
    alt: "Boussole d'orientation en verre translucide lavande",
    width: 800,
    height: 800,
    icon: 'compass',
  },
  objBook: {
    src: objBookSrc,
    alt: "Livre d'études ouvert en matière nacrée douce",
    width: 800,
    height: 800,
    icon: 'book',
  },
  objHourglass: {
    src: objHourglassSrc,
    alt: "Sablier en verre nacré avec sable violet pour préparation concours",
    width: 800,
    height: 800,
    icon: 'hourglass',
  },
  objTrophy: {
    src: objTrophySrc,
    alt: "Trophée de réussite académique en verre lavande",
    width: 800,
    height: 800,
    icon: 'trophy',
  },
  flowerSprout: {
    src: flowerSproutSrc,
    alt: "Fleur pourpre éclosant sur une sphère de verre nacré",
    width: 900,
    height: 900,
    icon: 'sparkles',
  },
  buildingColumns: {
    src: buildingColumnsSrc,
    alt: "Édifice universitaire classique aux colonnes de verre lavande parmi les fleurs",
    width: 1200,
    height: 1000,
    icon: 'building',
  },
  bgSoftBlob: {
    src: bgSoftBlobSrc,
    alt: "Dégradé abstrait violet et lavande flouté",
    width: 1600,
    height: 1200,
    icon: 'layers',
  },
  emptyState: {
    src: emptyStateSrc,
    alt: "Jeune pousse avec sphère de verre lavande symbolisant un début prometteur",
    width: 600,
    height: 600,
    icon: 'flower',
  },
};

export default VISUALS;

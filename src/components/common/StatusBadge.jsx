import React from 'react';

const STATUS_CONFIG = {
  // Goal Feasibility
  ON_TRACK: { label: 'Sur la bonne voie', tone: 'success' },
  AT_RISK: { label: 'À risque', tone: 'warning' },
  UNLIKELY: { label: 'Peu probable', tone: 'danger' },

  // Application Status
  DRAFT: { label: 'Brouillon', tone: 'neutral' },
  SUBMITTED: { label: 'Soumis', tone: 'lavender' },
  IN_REVIEW: { label: "En cours d'examen", tone: 'lavender' },
  ACCEPTED: { label: 'Accepté', tone: 'success' },
  REJECTED: { label: 'Refusé', tone: 'danger' },
  WAITLIST: { label: "Liste d'attente", tone: 'warning' },

  // Mentorship Status
  PENDING: { label: 'En attente', tone: 'warning' },
  SCHEDULED: { label: 'Planifiée', tone: 'lavender' },
  COMPLETED: { label: 'Terminée', tone: 'success' },
  CANCELLED: { label: 'Annulée', tone: 'danger' },
  REFUSED: { label: 'Refusée', tone: 'danger' },

  // User & Subscription Status
  ACTIVE: { label: 'Actif', tone: 'success' },
  SUSPENDED: { label: 'Suspendu', tone: 'danger' },
  EXPIRED: { label: 'Expiré', tone: 'neutral' },

  // Document Status
  UPLOADED: { label: 'Téléversé', tone: 'neutral' },
  VALIDATED: { label: 'Validé', tone: 'success' },

  // Student Stages
  PRE_BAC: { label: 'Pré-Bac', tone: 'lavender' },
  POST_BAC: { label: 'Post-Bac', tone: 'lavender' },
  CONCOURS_PREP: { label: 'Prépa Concours', tone: 'lavender' },

  // Roles
  STUDENT: { label: 'Étudiant', tone: 'lavender' },
  COUNSELOR: { label: 'Conseiller', tone: 'lavender' },
  ADMIN: { label: 'Administrateur', tone: 'danger' },
};

const TONE_CLASSES = {
  success: 'bg-[#4C9A7A]/12 text-[#2D6A52] border-[#4C9A7A]/30',
  warning: 'bg-[#D9A441]/14 text-[#8C6418] border-[#D9A441]/35',
  danger: 'bg-[#C75D6B]/12 text-[#9A3542] border-[#C75D6B]/30',
  lavender: 'bg-lavender-100 text-ink border-lavender-200/80',
  neutral: 'bg-neutral-100 text-ink-muted border-neutral-200/80',
};

export function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const normalized = String(status).toUpperCase();
  const config = STATUS_CONFIG[normalized] || {
    label: status,
    tone: 'neutral',
  };

  const toneClass = TONE_CLASSES[config.tone] || TONE_CLASSES.neutral;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide border shadow-2xs transition-colors ${toneClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 opacity-70 bg-current" />
      {config.label}
    </span>
  );
}

export default StatusBadge;

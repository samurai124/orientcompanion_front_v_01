/**
 * Formats date into French readable string (e.g. 20 Juillet 2024).
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

/**
 * Formats date and time into French readable string (e.g. 20 Juil. 2024 à 08:30).
 */
export function formatDateTime(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Formats academic grade to standard French 0-20 notation.
 */
export function formatGrade(grade) {
  if (grade === null || grade === undefined || isNaN(grade)) return '—';
  return `${Number(grade).toFixed(2).replace('.', ',')} / 20`;
}

/**
 * Formats price in Moroccan Dirhams (MAD).
 */
export function formatCurrency(amount) {
  if (amount === 0) return 'Gratuit';
  return `${Number(amount).toLocaleString('fr-FR')} MAD`;
}

import type { ResourceActionId } from '@/data/resourceNav';

export function ResourceNavIcon({ id, className }: { id: ResourceActionId; className?: string }) {
  if (id === 'toolbox') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M3 9h18v10H3z" />
        <path d="M9 9V7h6v2" />
        <path d="M3 13h18" />
        <path d="M11 13h2" />
      </svg>
    );
  }
  if (id === 'learn-more') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M5 5h10a4 4 0 0 1 4 4v10H9a4 4 0 0 0-4 4z" />
        <path d="M5 5v14a4 4 0 0 1 4-4h10" />
      </svg>
    );
  }
  if (id === 'references') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M4 5h10v14H4z" />
        <path d="M14 7h6v12h-6" />
        <path d="M7 9h4" />
        <path d="M7 12h4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m13 5-2 14" />
    </svg>
  );
}

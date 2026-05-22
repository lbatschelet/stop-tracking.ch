'use client';

import styles from './zine.module.css';

type ZineNavProps = {
  pageLabel: string;
  totalLabel: string;
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export function ZineNav({
  pageLabel,
  totalLabel,
  isFirst,
  isLast,
  onPrev,
  onNext,
}: ZineNavProps) {
  return (
    <div className={styles.nav}>
      <button type="button" onClick={onPrev} disabled={isFirst}>
        ← prev
      </button>
      <span className={styles.counter}>
        <span className={styles.counterNow}>{pageLabel}</span> / {totalLabel}
      </span>
      <button type="button" onClick={onNext} disabled={isLast}>
        next →
      </button>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './zine.module.css';

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function CitationLink({
  href,
  title,
  children,
  className,
}: {
  href: string;
  title: string;
  children: string;
  className?: string;
}) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState({ left: 0, top: 0, maxWidth: 420 });

  const updateTip = () => {
    const a = anchorRef.current;
    if (!a) return;
    const rect = a.getBoundingClientRect();
    const vw = window.innerWidth;
    const margin = 14;
    const maxWidth = Math.min(460, vw - margin * 2);
    const half = maxWidth / 2;
    const center = rect.left + rect.width / 2;
    const left = clamp(center, margin + half, vw - margin - half);
    const top = rect.top - 8;
    setTip({ left, top, maxWidth });
  };

  useEffect(() => {
    if (!open) return;
    updateTip();
    const onMove = () => updateTip();
    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);
    return () => {
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove);
    };
  }, [open]);

  const tooltip =
    open && typeof document !== 'undefined'
      ? createPortal(
          <span
            className={styles.citeTooltip}
            style={{
              left: `${tip.left}px`,
              top: `${tip.top}px`,
              maxWidth: `${tip.maxWidth}px`,
            }}
          >
            {title}
          </span>,
          document.body,
        )
      : null;

  return (
    <>
      <a
        ref={anchorRef}
        className={[styles.inlineAutoLink, styles.inlineCiteLink, className].filter(Boolean).join(' ')}
        href={href}
        aria-label={`${children}. ${title}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </a>
      {tooltip}
    </>
  );
}

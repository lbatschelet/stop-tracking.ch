'use client';

import { useEffect, useState, type ReactNode } from 'react';
import styles from './zine.module.css';
import { useTypewriter } from './TypewriterContext';

const MS_PER_CHAR = 2.2;
const MIN_CHARS_PER_FRAME = 2;
const MAX_CHARS_PER_FRAME = 14;

export function TypedBlock({
  index,
  charTotal,
  blockInstant,
  className,
  children,
}: {
  index: number;
  charTotal: number;
  blockInstant?: boolean;
  className?: string;
  children: (typing: { charLimit: number; done: boolean }) => ReactNode;
}) {
  const { activeBlock, instant: pageInstant, completeBlock } = useTypewriter();

  const instant = pageInstant || blockInstant || charTotal === 0;
  const waiting = !instant && index > activeBlock;
  const typing = !instant && index === activeBlock;
  const done = instant || index < activeBlock;

  const [charLimit, setCharLimit] = useState(instant ? Number.MAX_SAFE_INTEGER : 0);

  useEffect(() => {
    if (instant) {
      setCharLimit(Number.MAX_SAFE_INTEGER);
      return;
    }
    if (waiting) setCharLimit(0);
    else if (done) setCharLimit(Number.MAX_SAFE_INTEGER);
  }, [instant, waiting, done]);

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced && typing && charTotal > 0) {
      setCharLimit(Number.MAX_SAFE_INTEGER);
      completeBlock(index);
    }
  }, [typing, charTotal, completeBlock, index]);

  useEffect(() => {
    if (!typing) return;
    if (charTotal === 0) {
      completeBlock(index);
      return;
    }

    setCharLimit(0);
    let count = 0;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - last;
      const add = Math.min(
        MAX_CHARS_PER_FRAME,
        Math.max(MIN_CHARS_PER_FRAME, Math.floor(elapsed / MS_PER_CHAR)),
      );
      last = now;
      count = Math.min(charTotal, count + add);
      setCharLimit(count);

      if (count < charTotal) {
        raf = requestAnimationFrame(tick);
      } else {
        completeBlock(index);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [typing, index, charTotal, completeBlock]);

  if (instant) {
    return (
      <div className={[styles.typeBlock, className].filter(Boolean).join(' ')}>
        {children({ charLimit: Number.MAX_SAFE_INTEGER, done: true })}
      </div>
    );
  }

  const showCursor = typing && charLimit < charTotal;
  const reserveLayout = waiting || typing;

  return (
    <div className={[styles.typeSlot, className].filter(Boolean).join(' ')}>
      {reserveLayout && (
        <div className={styles.typeGhost} aria-hidden="true">
          {children({ charLimit: Number.MAX_SAFE_INTEGER, done: true })}
        </div>
      )}
      {!waiting && (
        <div className={[styles.typeBlock, typing && styles.typeBlockOverlay].filter(Boolean).join(' ')}>
          {children({
            charLimit: done ? Number.MAX_SAFE_INTEGER : charLimit,
            done,
          })}
          {showCursor && <span className={styles.typeCursor} aria-hidden>▌</span>}
        </div>
      )}
    </div>
  );
}

export { blockTypesInstant } from '@/content/blockText';

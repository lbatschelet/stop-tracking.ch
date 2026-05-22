'use client';

import { useCallback, useEffect, useState } from 'react';
import { zinePages } from './spreads';
import styles from './zine.module.css';
import { ZineNav } from './ZineNav';

export default function Zine() {
  const [index, setIndex] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const total = zinePages.length;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const pageLabel = String(index + 1).padStart(2, '0');
  const totalLabel = String(total).padStart(2, '0');

  const goPrev = useCallback(() => {
    setDirection('prev');
    setIndex((i) => Math.max(0, i - 1));
    setHintVisible(false);
  }, []);

  const goNext = useCallback(() => {
    setDirection('next');
    setIndex((i) => Math.min(total - 1, i + 1));
    setHintVisible(false);
  }, [total]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev]);

  useEffect(() => {
    const timer = window.setTimeout(() => setHintVisible(false), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  const page = zinePages[index];

  return (
    <div className={styles.zineRoot}>
      <div
        className={styles.hint}
        style={{ opacity: hintVisible ? 1 : 0 }}
        aria-hidden={!hintVisible}
      >
        ← / → or click the arrows
      </div>

      <div className={styles.stage}>
        <div className={styles.pageViewport}>
          <div className={styles.pageShell}>
            <div className={styles.terminalBar}>
              <span className={styles.terminalDots} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className={styles.terminalPath}>~/versteckis/{page.id}.md</span>
              <span className={styles.terminalState}>LIVE</span>
            </div>
            <div
              key={`${page.id}-${direction}`}
              className={[
                styles.pageInner,
                direction === 'next' ? styles.pageInNext : styles.pageInPrev,
              ].join(' ')}
            >
              {page.content}
            </div>
          </div>
        </div>
      </div>

      <ZineNav
        pageLabel={pageLabel}
        totalLabel={totalLabel}
        isFirst={isFirst}
        isLast={isLast}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
}

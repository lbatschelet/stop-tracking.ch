'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { zinePages } from './spreads';
import styles from './zine.module.css';
import { ZineNav } from './ZineNav';

export default function Zine() {
  const [index, setIndex] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);
  const [navGen, setNavGen] = useState(0);
  const indexRef = useRef(0);

  const total = zinePages.length;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const pageLabel = String(index + 1).padStart(2, '0');
  const totalLabel = String(total).padStart(2, '0');

  indexRef.current = index;

  const goPrevRef = useRef<() => void>(() => {});
  const goNextRef = useRef<() => void>(() => {});

  const goPrev = useCallback(() => {
    if (indexRef.current <= 0) return;
    setNavGen((g) => g + 1);
    setHintVisible(false);
    setIndex((i) => i - 1);
  }, []);

  const goNext = useCallback(() => {
    if (indexRef.current >= zinePages.length - 1) return;
    setNavGen((g) => g + 1);
    setHintVisible(false);
    setIndex((i) => i + 1);
  }, []);

  goPrevRef.current = goPrev;
  goNextRef.current = goNext;

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const start = touchStartRef.current;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    touchStartRef.current = null;

    if (Math.abs(dx) < 50) return;
    if (Math.abs(dx) < Math.abs(dy) * 1.2) return;

    if (dx < 0) goNextRef.current();
    else goPrevRef.current();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (indexRef.current >= zinePages.length - 1) return;
        e.preventDefault();
        goNextRef.current();
      }
      if (e.key === 'ArrowLeft') {
        if (indexRef.current <= 0) return;
        e.preventDefault();
        goPrevRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

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
        <span className={styles.hintDesktop}>← / → or click the arrows</span>
        <span className={styles.hintMobile}>swipe or tap the arrows</span>
      </div>

      <div className={styles.stage}>
        <div className={styles.pageViewport}>
          <div
            className={styles.pageShell}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className={styles.terminalBar}>
              <span className={styles.terminalDots} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className={styles.terminalPath}>~/versteckis/{page.id}.md</span>
              <span className={styles.terminalState}>LIVE</span>
            </div>
            <div key={`${page.id}-${navGen}`} className={styles.pageInner}>
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

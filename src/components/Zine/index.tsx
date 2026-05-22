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

  const goPrev = useCallback(() => {
    if (indexRef.current <= 0) return;
    setNavGen((g) => g + 1);
    setHintVisible(false);
    setIndex((i) => i - 1);
  }, []);

  const goNext = useCallback(() => {
    if (indexRef.current >= total - 1) return;
    setNavGen((g) => g + 1);
    setHintVisible(false);
    setIndex((i) => i + 1);
  }, [total]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (indexRef.current >= total - 1) return;
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft') {
        if (indexRef.current <= 0) return;
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev, total]);

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

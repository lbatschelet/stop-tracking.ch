'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ResourceNavIcon } from '@/components/ResourceNavIcon';
import { resourceActions } from '@/data/resourceNav';
import { zinePages } from './spreads';
import styles from './zine.module.css';
import { ZineNav } from './ZineNav';

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function shortestDelta(from: number, to: number) {
  return ((to - from + 540) % 360) - 180;
}

function MiniPanopticonBadge() {
  const beamRef = useRef<SVGGElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const beam = beamRef.current;
    const svg = svgRef.current;
    if (!beam || !svg) return;
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      beam.setAttribute('transform', 'rotate(34 50 49)');
      return;
    }

    const BASE_BEAM_ANGLE = 27.5;
    const POINTER_FALLOFF_MS = 1200;

    let currentAngle = rand(0, 360);
    let targetAngle = currentAngle;
    let lastPointerAt = 0;
    let randomHoldUntil = performance.now() + rand(800, 2200);
    let raf = 0;
    let last = performance.now();

    const updateTargetFromClient = (clientX: number, clientY: number) => {
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.49;
      const dx = clientX - cx;
      const dy = clientY - cy;
      targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI - BASE_BEAM_ANGLE;
      lastPointerAt = performance.now();
    };

    const onPointerMove = (e: PointerEvent) => {
      updateTargetFromClient(e.clientX, e.clientY);
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      updateTargetFromClient(t.clientX, t.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      updateTargetFromClient(t.clientX, t.clientY);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const pointerActive = now - lastPointerAt < POINTER_FALLOFF_MS;
      if (!pointerActive && now >= randomHoldUntil) {
        targetAngle = rand(0, 360);
        randomHoldUntil = now + rand(1000, 3000);
      }

      const diff = shortestDelta(currentAngle, targetAngle);
      const factor = pointerActive ? 8.5 : 3.6;
      const t = easeInOutSine(Math.min(1, dt * factor));
      currentAngle += diff * t;

      beam.setAttribute('transform', `rotate(${currentAngle} 50 49)`);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 100 100" className={styles.miniPanopticon} aria-hidden="true">
      <ellipse cx="50" cy="34" rx="34" ry="10" className={styles.miniRing} />
      <ellipse cx="50" cy="52" rx="39" ry="12" className={styles.miniRing} />
      <ellipse cx="50" cy="72" rx="42" ry="14" className={styles.miniRing} />
      <ellipse cx="50" cy="54" rx="10.5" ry="4.6" className={styles.miniTowerTop} />
      <rect x="42.4" y="54" width="15.2" height="22" className={styles.miniTowerBody} />
      <g ref={beamRef}>
        <path d="M50 49 L81 65 L71 79 Z" className={styles.miniBeam} />
      </g>
    </svg>
  );
}

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
          <div className={styles.frameWithActions}>
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
                <span className={styles.terminalPath}>~/stop-tracking/{page.id}.md</span>
                <span className={styles.terminalState}>
                  {page.id === 'cover' ? 'LIVE' : <MiniPanopticonBadge />}
                </span>
              </div>
              <div key={`${page.id}-${navGen}`} className={styles.pageInner}>
                {page.content}
              </div>
            </div>
            <nav className={styles.externalActions} aria-label="Further resources">
              {resourceActions.map((action) => {
                const className = styles.externalActionButton;
                const icon = <ResourceNavIcon id={action.id} className={styles.externalIconSvg} />;

                if (action.external) {
                  return (
                    <a
                      key={action.id}
                      className={className}
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={action.label}
                      data-label={action.label}
                    >
                      {icon}
                    </a>
                  );
                }

                return (
                  <Link
                    key={action.id}
                    className={className}
                    href={action.href}
                    aria-label={action.label}
                    data-label={action.label}
                  >
                    {icon}
                  </Link>
                );
              })}
            </nav>
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

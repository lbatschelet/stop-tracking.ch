'use client';

import { useEffect, useRef } from 'react';
import styles from './zine.module.css';

const TOWER_X = 50;
const TOWER_Y = 47;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function shortestDelta(from: number, to: number) {
  return ((to - from + 540) % 360) - 180;
}

function CellRing({ cy, rx, ry }: { cy: number; rx: number; ry: number }) {
  return (
    <ellipse
      cx="50"
      cy={cy}
      rx={rx}
      ry={ry}
      fill="url(#cellPattern)"
      stroke="rgba(220,220,220,0.35)"
      strokeWidth="0.5"
    />
  );
}

function BeamPaths() {
  return (
    <>
      <path d="M0 0 L44 19 L28 36 Z" fill="url(#beamHalo)" opacity="0.55" filter="url(#beamSoft)" />
      <path d="M0 0 L38 16 L24 29 Z" fill="url(#beamGlow)" filter="url(#beamSoft)" />
    </>
  );
}

function Tower() {
  return (
    <>
      <rect x="41.5" y="49" width="17" height="24" fill="#171717" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      <ellipse cx="50" cy="73" rx="8.5" ry="3.5" fill="#111" stroke="rgba(255,255,255,0.17)" strokeWidth="0.4" />
      <ellipse cx="50" cy="49" rx="11" ry="4.6" fill="#1b1b1b" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
      <rect x="44" y="43.8" width="12" height="5.2" fill="#141414" stroke="rgba(255,255,255,0.14)" strokeWidth="0.3" />
      <ellipse cx="50" cy="45.5" rx="6.5" ry="2.9" fill="#101010" stroke="rgba(255,255,255,0.38)" strokeWidth="0.4" />
    </>
  );
}

export function PanopticonVisual() {
  const beamRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const beam = beamRef.current;
    if (!beam) return;

    const applyBeam = (angle: number) => {
      beam.setAttribute('transform', `rotate(${angle})`);
    };

    if (reduced) {
      applyBeam(42);
      return;
    }

    let angle = rand(0, 360);
    let fromAngle = angle;
    let toAngle = angle;
    let segmentStart = performance.now();
    let segmentDuration = rand(3200, 7800);
    let raf = 0;

    const nextSegment = (now: number) => {
      fromAngle = angle;
      toAngle = fromAngle + shortestDelta(fromAngle, rand(0, 360));
      segmentStart = now;
      segmentDuration = rand(2800, 8200);
    };

    nextSegment(segmentStart);
    applyBeam(angle);

    const tick = (now: number) => {
      const elapsed = now - segmentStart;
      if (elapsed >= segmentDuration) {
        angle = toAngle;
        nextSegment(now);
      }

      const t = easeInOutSine(Math.min(1, (now - segmentStart) / segmentDuration));
      angle = fromAngle + (toAngle - fromAngle) * t;

      applyBeam(angle);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const beamOrigin = `translate(${TOWER_X} ${TOWER_Y})`;

  return (
    <div className={styles.coverVisual} aria-hidden="true">
      <svg viewBox="-18 -12 136 102" className={styles.coverSvg}>
        <defs>
          <filter id="beamSoft" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="beamGlow" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="38" y2="16">
            <stop offset="0%" stopColor="rgba(245,249,168,0.82)" />
            <stop offset="80%" stopColor="rgba(245,249,168,0.2)" />
            <stop offset="100%" stopColor="rgba(245,249,168,0)" />
          </linearGradient>
          <linearGradient id="beamHalo" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="42" y2="20">
            <stop offset="0%" stopColor="rgba(245,249,168,0.35)" />
            <stop offset="100%" stopColor="rgba(245,249,168,0)" />
          </linearGradient>
          <pattern id="cellPattern" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="none" />
            <path d="M0 0 L0 6 M3 0 L3 6 M0 3 L6 3" stroke="rgba(215,215,215,0.22)" strokeWidth="0.3" />
          </pattern>
        </defs>

        {/* Back rings — behind the tower */}
        <CellRing cy={20} rx={43} ry={10} />
        <CellRing cy={34} rx={47} ry={13} />

        <Tower />

        {/* Front rings — in front of the tower */}
        <CellRing cy={50} rx={50} ry={16} />
        <CellRing cy={68} rx={53} ry={19} />

        <g transform={beamOrigin}>
          <g ref={beamRef} className={styles.coverBeam}>
            <BeamPaths />
          </g>
        </g>
      </svg>
    </div>
  );
}

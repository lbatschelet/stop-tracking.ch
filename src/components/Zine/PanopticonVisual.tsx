'use client';

import { useEffect, useRef } from 'react';
import styles from './zine.module.css';

const TOWER_X = 50;
const TOWER_Y = 47;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
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
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const beam = beamRef.current;
    const svg = svgRef.current;
    if (!beam || !svg) return;

    const BASE_BEAM_ANGLE = 27.5;
    const POINTER_FALLOFF_MS = 1200;

    const applyBeam = (angle: number) => {
      beam.setAttribute('transform', `rotate(${angle})`);
    };

    if (reduced) {
      applyBeam(42);
      return;
    }

    let currentAngle = rand(0, 360);
    let desiredAngle = currentAngle;
    let smoothedTarget = currentAngle;
    let speed = 0;
    let direction = 1;
    let phase: 'hold' | 'move' = 'hold';
    let holdUntil = performance.now() + rand(120, 300);
    let lastPointerAt = 0;
    let randomPickAt = performance.now() + rand(900, 2600);
    let raf = 0;
    let last = performance.now();

    const MAX_SPEED = 58; // deg/s
    const ACCEL = 42; // deg/s^2
    const DECEL = 58; // deg/s^2
    const ARRIVE_EPS = 0.8; // deg

    const updateTargetFromClient = (clientX: number, clientY: number) => {
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.49;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const dist = Math.hypot(dx, dy);
      // Around the center the angle becomes unstable; ignore that noise.
      if (dist < Math.max(rect.width, rect.height) * 0.06) return;
      desiredAngle = (Math.atan2(dy, dx) * 180) / Math.PI - BASE_BEAM_ANGLE;
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
    applyBeam(currentAngle);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const pointerActive = now - lastPointerAt < POINTER_FALLOFF_MS;
      if (!pointerActive && now >= randomPickAt) {
        desiredAngle = rand(0, 360);
        randomPickAt = now + rand(1800, 4200);
      }

      // Smooth out raw target jumps (mouse/touch/random) before movement logic.
      const targetSmoothing = pointerActive ? 6.2 : 2.8;
      smoothedTarget +=
        shortestDelta(smoothedTarget, desiredAngle) * (1 - Math.exp(-targetSmoothing * dt));

      const diff = shortestDelta(currentAngle, smoothedTarget);
      const absDiff = Math.abs(diff);
      const desiredDir = diff >= 0 ? 1 : -1;

      if (phase === 'hold') {
        speed = 0;
        if (now >= holdUntil && absDiff > ARRIVE_EPS) {
          direction = desiredDir;
          phase = 'move';
        }
      } else {
        if (absDiff <= ARRIVE_EPS) {
          currentAngle = smoothedTarget;
          speed = 0;
          phase = 'hold';
          holdUntil = now + (pointerActive ? 90 : rand(150, 340));
          applyBeam(currentAngle);
          raf = requestAnimationFrame(tick);
          return;
        }

        // If target flips behind us: brake to stop, short hold, then re-accelerate.
        if (desiredDir !== direction) {
          speed = Math.max(0, speed - DECEL * dt);
          if (speed === 0) {
            direction = desiredDir;
            phase = 'hold';
            holdUntil = now + (pointerActive ? 90 : rand(120, 260));
          }
        } else {
          // Kinematic profile: accelerate early, decelerate naturally near target.
          const distanceLimitedSpeed = Math.sqrt(Math.max(0, 2 * DECEL * absDiff));
          const targetSpeed = Math.min(MAX_SPEED, distanceLimitedSpeed);
          if (speed < targetSpeed) speed = Math.min(targetSpeed, speed + ACCEL * dt);
          else speed = Math.max(targetSpeed, speed - DECEL * dt);

          const step = speed * dt;
          if (step >= absDiff) {
            currentAngle = smoothedTarget;
            speed = 0;
            phase = 'hold';
            holdUntil = now + (pointerActive ? 90 : rand(150, 340));
          } else if (speed > 0) {
            currentAngle += direction * step;
          }
        }
      }

      applyBeam(currentAngle);
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

  const beamOrigin = `translate(${TOWER_X} ${TOWER_Y})`;

  return (
    <div className={styles.coverVisual} aria-hidden="true">
      <svg ref={svgRef} viewBox="-18 -12 136 102" className={styles.coverSvg}>
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

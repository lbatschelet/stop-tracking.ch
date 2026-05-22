import type { CSSProperties, ReactNode } from 'react';
import styles from './zine.module.css';

type PageProps = {
  side: 'left' | 'right';
  center?: boolean;
  vCenter?: boolean;
  style?: CSSProperties;
  children: ReactNode;
};

export function Page({ side, center, vCenter, style, children }: PageProps) {
  const sideClass = side === 'left' ? styles.pageLeft : styles.pageRight;
  return (
    <div
      className={[
        styles.page,
        sideClass,
        center ? styles.center : '',
        vCenter ? styles.vCenter : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </div>
  );
}

/** Einzelne A5-Seite (Cover/Rückseite) — kein Spread-Falz, voller Rand */
export function PageAlone({
  center,
  vCenter,
  style,
  className,
  children,
}: {
  center?: boolean;
  vCenter?: boolean;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={[
        styles.page,
        styles.pageAlone,
        center ? styles.center : '',
        !center && vCenter ? styles.vCenter : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </div>
  );
}

export function Rec({ className }: { className?: string }) {
  return (
    <span className={[styles.rec, className].filter(Boolean).join(' ')}>
      <span className={styles.recDot} />
      REC
    </span>
  );
}

export function Tag({
  variant,
  children,
}: {
  variant: 'warm' | 'cool';
  children: ReactNode;
}) {
  const variantClass = variant === 'warm' ? styles.tagWarm : styles.tagCool;
  return <div className={[styles.tag, variantClass].join(' ')}>{children}</div>;
}

export function Zh({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <h1 className={[styles.zh, className].filter(Boolean).join(' ')} style={style}>
      {children}
    </h1>
  );
}

export function Zb({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <p className={[styles.zb, className].filter(Boolean).join(' ')} style={style}>
      {children}
    </p>
  );
}

export function Cmd({
  comment,
  command,
  note,
}: {
  comment?: string;
  command: ReactNode;
  note?: ReactNode;
}) {
  return (
    <div className={styles.cmd}>
      {comment && (
        <>
          <span className={styles.cmdComment}>{comment}</span>
          <br />
        </>
      )}
      <span className={styles.cmdPrompt}>$</span>{' '}
      <span className={styles.cmdNote}>
        {command}
        {note && <> {note}</>}
      </span>
    </div>
  );
}

export function Bracket({ position, children }: { position: 'top' | 'bot'; children: ReactNode }) {
  const posClass = position === 'top' ? styles.bracketTop : styles.bracketBot;
  return <div className={[styles.bracket, posClass].join(' ')}>{children}</div>;
}

export function Lawbox({ children }: { children: ReactNode }) {
  return <div className={styles.lawbox}>{children}</div>;
}

export function Cursor() {
  return <span className={styles.cursor} />;
}

export function Pull({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <p className={[styles.pull, className].filter(Boolean).join(' ')} style={style}>
      {children}
    </p>
  );
}

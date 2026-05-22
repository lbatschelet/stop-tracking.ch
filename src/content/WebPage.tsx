import styles from '@/components/Zine/zine.module.css';
import type { CSSProperties } from 'react';
import {
  Bracket,
  Cursor,
  Page,
  PageAlone,
  Pull,
  Rec,
  Tag,
  Zh,
  Zb,
} from '@/components/Zine/primitives';
import { DownloadPdfLink } from '@/components/Zine/DownloadPdfLink';
import { orgLinks, toolkitLinks } from '@/data/toolkit';
import type { Line, Run, Tone, ZineBlock, ZinePageDef } from './types';

const toneClass: Record<Tone, string> = {
  white: styles.white,
  amber: styles.amber,
  red: styles.red,
  green: styles.green,
  cyan: styles.cyan,
  dim: styles.dim,
  redact: styles.redact,
  hlRed: styles.hlRed,
  bold: styles.iBold,
  italic: styles.iItalic,
};

type RichPiece = string | { text: string; tone: Tone } | { text: string; className: string };

const dangerWords = new Set([
  'surveillance',
  'watched',
  'watching',
  'watch',
  'tracked',
  'tracking',
  'police',
  'state',
  'flagged',
  'risk',
  'targeted',
  'target',
]);

const actionWords = new Set([
  'encrypt',
  'encrypted',
  'encryption',
  'protect',
  'defend',
  'disable',
  'delete',
  'resist',
  'verify',
  'secure',
  'safety',
  'private',
  'privacy',
]);

const signalWords = new Set([
  'data',
  'metadata',
  'algorithm',
  'model',
  'face',
  'location',
  'device',
  'network',
  'phone',
  'browser',
  'id',
]);

const groupedToolkitLinks = toolkitLinks.reduce(
  (acc, tool) => {
    if (!acc[tool.key]) acc[tool.key] = [];
    acc[tool.key].push(tool);
    return acc;
  },
  {} as Record<string, typeof toolkitLinks>,
);

/**
 * Parse a plain string for inline **bold** and *italic* markdown.
 * Returns a flat list of runs (string or { text, tone }).
 * Order matters: ** must be tested before *.
 */
function parseMd(s: string): (string | { text: string; tone: Tone })[] {
  const out: (string | { text: string; tone: Tone })[] = [];
  const re = /\*\*([^*]+?)\*\*|\*([^*]+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push(s.slice(last, m.index));
    if (m[1] !== undefined) out.push({ text: m[1], tone: 'bold' });
    else if (m[2] !== undefined) out.push({ text: m[2], tone: 'italic' });
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out.length === 0 ? [s] : out;
}

function highlightKeywords(s: string): RichPiece[] {
  const out: RichPiece[] = [];
  const re =
    /\b(surveillance|watched|watching|watch|tracked|tracking|police|state|flagged|risk|targeted|target|encrypt(?:ed|ion)?|protect|defend|disable|delete|resist|verify|secure|safety|private|privacy|data|metadata|algorithm|model|face|location|device|network|phone|browser|id)\b/gi;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const raw = m[0];
    const key = raw.toLowerCase();
    const className = dangerWords.has(key)
      ? styles.kwDanger
      : actionWords.has(key)
        ? styles.kwAction
        : signalWords.has(key)
          ? styles.kwSignal
          : '';
    out.push(className ? { text: raw, className } : raw);
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out.length === 0 ? [s] : out;
}

function parseInline(s: string): RichPiece[] {
  const out: RichPiece[] = [];
  const codeRe = /`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = codeRe.exec(s)) !== null) {
    if (m.index > last) out.push(...highlightKeywords(s.slice(last, m.index)));
    out.push({ text: m[1], className: styles.inlineCode });
    last = codeRe.lastIndex;
  }
  if (last < s.length) out.push(...highlightKeywords(s.slice(last)));
  return out.length === 0 ? [s] : out;
}

function RunPiece({ piece }: { piece: RichPiece }) {
  if (typeof piece === 'string') return <>{piece}</>;
  if ('className' in piece) return <span className={piece.className}>{piece.text}</span>;
  return <span className={toneClass[piece.tone]}>{piece.text}</span>;
}

function RunSpan({ run }: { run: Run }) {
  if (typeof run === 'string') {
    const parts = parseMd(run).flatMap((p) => (typeof p === 'string' ? parseInline(p) : [p]));
    return (
      <>
        {parts.map((p, i) => (
          <RunPiece key={i} piece={p} />
        ))}
      </>
    );
  }
  return <span className={toneClass[run.tone]}>{run.text}</span>;
}

function LineContent({ line }: { line: Line }) {
  if (typeof line === 'string') return <RunSpan run={line} />;
  return (
    <>
      {line.map((run, i) => (
        <RunSpan key={i} run={run} />
      ))}
    </>
  );
}

function lineKey(line: Line, i: number): string {
  if (typeof line === 'string') return `${i}:${line.slice(0, 40)}`;
  const first = line[0];
  const head = typeof first === 'string' ? first : first?.text ?? '';
  return `${i}:${head.slice(0, 40)}`;
}

/** Render an array of lines as paragraph fragments joined by <br>. */
function Lines({ lines }: { lines: Line[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={lineKey(line, i)}>
          {i > 0 && <br />}
          <LineContent line={line} />
        </span>
      ))}
    </>
  );
}

/** Render an array of lines as separate <p> paragraphs (used inside boxes). */
function Paragraphs({ lines, className }: { lines: Line[]; className?: string }) {
  return (
    <>
      {lines.map((line, i) => (
        <p key={lineKey(line, i)} className={[styles.zb, className].filter(Boolean).join(' ')}>
          <LineContent line={line} />
        </p>
      ))}
    </>
  );
}

function Block({ block, side, inBox = false }: { block: ZineBlock; side: 'left' | 'right'; inBox?: boolean }) {
  switch (block.kind) {
    case 'cover':
      return (
        <>
          <Rec className={styles.recCover} />
          <h1 className={styles.coverTitle}>
            ESCAPING
            <br />
            THE PANOPTICON
          </h1>
          <p className={styles.coverSub}>
            a zine on AI, state surveillance
            <br />
            &amp; digital self-defense
          </p>
          <p className={styles.coverBottom}>Who gets watched is never an accident.</p>
        </>
      );
    case 'toolkit':
      return (
        <div className={styles.toolkit}>
          <h3>{'// toolkit'}</h3>
          {Object.entries(groupedToolkitLinks).map(([key, tools]) => (
            <div key={key}>
              <span className={styles.toolkitKey}>{key}</span> &nbsp;→&nbsp;{' '}
              {tools.map((tool, i) => (
                <span key={`${tool.key}-${tool.label}`}>
                  {i > 0 && ', '}
                  <a className={styles.zineLink} href={tool.href} target="_blank" rel="noopener noreferrer">
                    {tool.label}
                  </a>
                </span>
              ))}
            </div>
          ))}
          <h3>{'// learn more'}</h3>
          {orgLinks.map((org) => (
            <div key={org.href}>
              <a className={styles.zineLink} href={org.href} target="_blank" rel="noopener noreferrer">
                {org.label}
              </a>
            </div>
          ))}
        </div>
      );
    case 'tag':
      return (
        <Tag variant={block.variant}>
          {block.rec && (
            <span className={styles.rec}>
              <span className={styles.recDot} />
            </span>
          )}{' '}
          {block.text}
        </Tag>
      );
    case 'h':
      return (
        <Zh className={styles.blockH}>
          <Lines lines={block.lines} />
        </Zh>
      );
    case 'p': {
      const tone =
        block.tone === 'dim'
          ? styles.dim
          : block.tone === 'green'
            ? styles.green
            : block.tone === 'amber'
              ? styles.amber
              : undefined;
      return (
        <Zb className={[!inBox ? styles.blockP : '', tone].filter(Boolean).join(' ')}>
          <Lines lines={block.lines} />
        </Zb>
      );
    }
    case 'pull': {
      const big = block.size === 'big';
      return (
        <Pull
          className={styles.blockPull}
          style={{
            fontSize: big ? 'clamp(20px, 2.5vw, 32px)' : 'clamp(14px, 1.6vw, 18px)',
            marginTop: 18,
            marginBottom: 18,
            textAlign: side === 'left' ? 'left' : 'left',
            color: big ? 'var(--amber)' : '#d0e8d0',
            fontWeight: big ? 700 : 500,
            lineHeight: 1.2,
          }}
        >
          <Lines lines={block.lines} />
          {block.sub && (
            <>
              <br />
              <span className={styles.dim}>{block.sub}</span>
            </>
          )}
        </Pull>
      );
    }
    case 'step':
      return (
        <p className={[styles.step, !inBox ? styles.blockP : ''].filter(Boolean).join(' ')}>
          <span className={styles.stepLead}>{block.lead}</span>{' '}
          <LineContent line={block.body[0] ?? ''} />
          {block.body.slice(1).map((line, i) => (
            <span key={i}>
              {' '}
              <LineContent line={line} />
            </span>
          ))}
        </p>
      );
    case 'source':
      return (
        <p className={styles.source}>
          <RunSpan run={block.text} />
        </p>
      );
    case 'safety':
      return (
        <div className={[styles.safety, styles.blockP].join(' ')}>
          <span className={styles.safetyTag}>SAFETY ·</span>{' '}
          <Lines lines={block.lines} />
        </div>
      );
    case 'cta':
      return (
        <p className={[styles.cta, styles.blockPull].join(' ')}>
          <Lines lines={block.lines} />
        </p>
      );
    case 'resourcebar':
      return (
        <p className={[styles.resourcebar, styles.blockP].join(' ')}>
          {block.items.map((item, i) => (
            <span key={item.label}>
              {i > 0 && <span className={styles.resourceSep}> · </span>}
              {item.href ? (
                <a
                  className={styles.zineLink}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              ) : (
                item.label
              )}
            </span>
          ))}
        </p>
      );
    case 'bottomline':
      return <p className={[styles.coverBottom, styles.blockP].join(' ')}>{block.text}</p>;
    case 'bracket':
      return <Bracket position="top">{block.text}</Bracket>;
    case 'box':
      return (
        <details className={styles.box}>
          <summary className={styles.boxSummary}>
            <span className={styles.boxBracket} aria-hidden="true" />
            <span className={styles.boxTitle}>{block.title}</span>
          </summary>
          <div className={styles.boxBody}>
            {block.blocks.map((sub, i) => (
              <Block key={i} block={sub} side={side} inBox />
            ))}
          </div>
        </details>
      );
    default:
      return null;
  }
}

type WebPageProps = {
  page: ZinePageDef;
  side: 'left' | 'right';
};

export function WebPage({ page, side }: WebPageProps) {
  const inner = page.blocks.map((block, i) => (
    <div
      key={`${page.id}-${i}`}
      className={[styles.blockEnter, block.kind === 'source' ? styles.footerBlock : ''].filter(Boolean).join(' ')}
      style={{ '--block-i': i } as CSSProperties}
    >
      <Block block={block} side={side} />
    </div>
  ));

  if (page.alone) {
    return (
      <PageAlone
        center={page.center}
        vCenter={page.vCenter}
        style={page.bg ? { background: page.bg } : undefined}
      >
        {inner}
        {page.blocks.some((b) => b.kind === 'toolkit') && <ToolkitFooter />}
      </PageAlone>
    );
  }

  return (
    <Page side={side} center={page.center} vCenter={page.vCenter}>
      {inner}
      {page.blocks.some((b) => b.kind === 'toolkit') && <ToolkitFooter />}
    </Page>
  );
}

function ToolkitFooter() {
  return (
    <>
      <Zb className={styles.green} style={{ marginTop: 18, textAlign: 'left' }}>
        Copy it. Share it. Print it —{' '}
        <DownloadPdfLink />
        <Cursor />
      </Zb>
      <Credits />
    </>
  );
}

function Credits() {
  return (
    <div className={styles.credits}>
      <a
        className={styles.creditsLink}
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        target="_blank"
        rel="noopener noreferrer"
      >
        CC BY-NC-SA 4.0
      </a>
      {' · 2026 · '}
      <a
        className={styles.creditsLink}
        href="https://lukasbatschelet.ch"
        target="_blank"
        rel="noopener noreferrer"
      >
        Lukas Batschelet
      </a>
      {' & Lukas Bauer'}
    </div>
  );
}

/* Paragraphs is exported for any future use inside boxes that want stacked <p>. */
export { Paragraphs };

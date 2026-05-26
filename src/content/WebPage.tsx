import styles from '@/components/Zine/zine.module.css';
import type { ReactNode } from 'react';
import {
  Bracket,
  Page,
  PageAlone,
  Pull,
  Tag,
  Zh,
  Zb,
} from '@/components/Zine/primitives';
import { PanopticonVisual } from '@/components/Zine/PanopticonVisual';
import { CitationLink } from '@/components/Zine/CitationLink';
import { TypedBlock, blockTypesInstant } from '@/components/Zine/TypedBlock';
import { TypewriterProvider } from '@/components/Zine/TypewriterContext';
import { blockCharCount, linesCharCount, sourceVisibleText } from '@/content/blockText';
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

type RichPiece =
  | string
  | { text: string; tone: Tone }
  | { text: string; className: string }
  | { text: string; href: string; title?: string };

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
  const tokenRe = /`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+)(?:\s+"([^"]+)")?\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(s)) !== null) {
    if (m.index > last) out.push(...highlightKeywords(s.slice(last, m.index)));
    if (m[1] !== undefined) {
      out.push({ text: m[1], className: styles.inlineCode });
    } else {
      out.push({ text: m[2], href: m[3], title: m[4] });
    }
    last = tokenRe.lastIndex;
  }
  if (last < s.length) out.push(...highlightKeywords(s.slice(last)));
  return out.length === 0 ? [s] : out;
}

function linkify(s: string): RichPiece[] {
  const out: RichPiece[] = [];
  const re = /(https?:\/\/[^\s)]+|www\.[^\s)]+)/gi;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const urlText = m[0];
    const href = urlText.startsWith('http') ? urlText : `https://${urlText}`;
    out.push({ text: urlText, href });
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out.length === 0 ? [s] : out;
}

function RunPiece({ piece }: { piece: RichPiece }) {
  if (typeof piece === 'string') return <>{piece}</>;
  if ('href' in piece) {
    const hasCite = typeof piece.title === 'string' && piece.title.length > 0;
    if (hasCite) {
      return (
        <CitationLink href={piece.href} title={piece.title!}>
          {piece.text}
        </CitationLink>
      );
    }
    return (
      <a
        className={styles.inlineAutoLink}
        href={piece.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {piece.text}
      </a>
    );
  }
  if ('className' in piece) return <span className={piece.className}>{piece.text}</span>;
  return <span className={toneClass[piece.tone]}>{piece.text}</span>;
}

function RunSpan({ run, plain = false }: { run: Run; plain?: boolean }) {
  if (typeof run === 'string') {
    const parts = parseMd(run).flatMap((p) => {
      if (typeof p !== 'string') return [p];
      const parsed = plain ? [p] : parseInline(p);
      return parsed.flatMap((piece) =>
        typeof piece === 'string' ? linkify(piece) : [piece],
      );
    });
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

function LineContent({ line, plain = false }: { line: Line; plain?: boolean }) {
  if (typeof line === 'string') return <RunSpan run={line} plain={plain} />;
  return (
    <>
      {line.map((run, i) => (
        <RunSpan key={i} run={run} plain={plain} />
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

function takeFromLine(line: Line, maxChars: number): { content: Line | null; used: number } {
  if (maxChars <= 0) return { content: null, used: 0 };
  if (typeof line === 'string') {
    const take = line.slice(0, maxChars);
    return { content: take, used: take.length };
  }
  const out: Run[] = [];
  let remaining = maxChars;
  for (const run of line) {
    if (remaining <= 0) break;
    if (typeof run === 'string') {
      const take = run.slice(0, remaining);
      if (take) out.push(take);
      remaining -= take.length;
    } else {
      const take = run.text.slice(0, remaining);
      if (take) out.push({ text: take, tone: run.tone });
      remaining -= take.length;
    }
  }
  return { content: out.length ? out : null, used: maxChars - remaining };
}

/** Render an array of lines as paragraph fragments joined by <br>. */
function Lines({
  lines,
  plain = false,
  charLimit,
}: {
  lines: Line[];
  plain?: boolean;
  charLimit?: number;
}) {
  if (charLimit === undefined) {
    return (
      <>
        {lines.map((line, i) => (
          <span key={lineKey(line, i)}>
            {i > 0 && <br />}
            <LineContent line={line} plain={plain} />
          </span>
        ))}
      </>
    );
  }

  let remaining = charLimit;
  const nodes: ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (remaining <= 0) break;
    if (i > 0) {
      if (remaining < 1) break;
      remaining -= 1;
      nodes.push(<br key={`br-${i}`} />);
    }
    const { content, used } = takeFromLine(lines[i], remaining);
    if (!content || used === 0) break;
    remaining -= used;
    nodes.push(
      <span key={lineKey(lines[i], i)}>
        <LineContent line={content} plain={plain} />
      </span>,
    );
  }
  return <>{nodes}</>;
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

function Block({
  block,
  side,
  inBox = false,
  inReferences = false,
  charLimit,
}: {
  block: ZineBlock;
  side: 'left' | 'right';
  inBox?: boolean;
  inReferences?: boolean;
  charLimit?: number;
}) {
  const limit = charLimit;

  switch (block.kind) {
    case 'cover':
      return (
        <div className={styles.coverLayout}>
          <PanopticonVisual />
          <div className={styles.coverText}>
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
          </div>
        </div>
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
    case 'tag': {
      const full = `${block.rec ? 'REC ' : ''}${block.text}`;
      const shown = limit === undefined ? full : full.slice(0, limit);
      const showRec = block.rec && shown.length > 0;
      const text = block.rec ? shown.replace(/^REC ?/, '') : shown;
      return (
        <Tag variant={block.variant}>
          {showRec && (
            <span className={styles.rec}>
              <span className={styles.recDot} />
            </span>
          )}{' '}
          {text}
        </Tag>
      );
    }
    case 'h':
      return (
        <Zh className={styles.blockH}>
          <Lines lines={block.lines} plain={inReferences} charLimit={limit} />
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
          <Lines lines={block.lines} plain={inReferences} charLimit={limit} />
        </Zb>
      );
    }
    case 'pull': {
      const big = block.size === 'big';
      const mainCount = linesCharCount(block.lines);
      const subPart = block.sub ? 1 + block.sub.length : 0;
      const mainLimit = limit === undefined ? undefined : Math.min(limit, mainCount);
      const subLimit =
        limit === undefined || limit <= mainCount
          ? undefined
          : limit - mainCount - (limit > mainCount ? 1 : 0);
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
          <Lines lines={block.lines} plain={inReferences} charLimit={mainLimit} />
          {block.sub && subLimit !== undefined && subLimit > 0 && (
            <>
              <br />
              <span className={styles.dim}>{block.sub.slice(0, subLimit - 1)}</span>
            </>
          )}
          {block.sub && limit === undefined && (
            <>
              <br />
              <span className={styles.dim}>{block.sub}</span>
            </>
          )}
        </Pull>
      );
    }
    case 'step': {
      const leadLen = block.lead.length;
      const leadLimit = limit === undefined ? block.lead : block.lead.slice(0, Math.min(limit, leadLen));
      const bodyLimit = limit === undefined ? undefined : limit > leadLen + 1 ? limit - leadLen - 1 : 0;
      return (
        <p className={[styles.step, !inBox ? styles.blockP : ''].filter(Boolean).join(' ')}>
          <span className={styles.stepLead}>{leadLimit}</span>
          {bodyLimit !== undefined && bodyLimit > 0 && (
            <>
              {' '}
              <Lines lines={block.body} plain={inReferences} charLimit={bodyLimit} />
            </>
          )}
          {limit === undefined && (
            <>
              {' '}
              <LineContent line={block.body[0] ?? ''} plain={inReferences} />
              {block.body.slice(1).map((line, i) => (
                <span key={i}>
                  {' '}
                  <LineContent line={line} plain={inReferences} />
                </span>
              ))}
            </>
          )}
        </p>
      );
    }
    case 'source':
      if (limit !== undefined) {
        const visible = sourceVisibleText(block.text);
        if (limit < visible.length) {
          return <p className={styles.source}>{visible.slice(0, limit)}</p>;
        }
      }
      return (
        <p className={styles.source}>
          <RunSpan run={block.text} plain={inReferences} />
        </p>
      );
    case 'callout': {
      const title = block.title?.trim() ?? '';
      const hasTitle = title.length > 0;
      const titleLimit = limit === undefined ? title.length : Math.min(title.length, limit);
      const bodyLimit =
        limit === undefined
          ? undefined
          : hasTitle
            ? limit > title.length + 1
              ? limit - title.length - 1
              : 0
            : limit;
      return (
        <div className={styles.calloutBox}>
          {hasTitle && <div className={styles.calloutHeader}>{title.slice(0, titleLimit)}</div>}
          {(bodyLimit === undefined || bodyLimit > 0) && (
            <p className={styles.calloutText}>
              <Lines lines={block.lines} plain={inReferences} charLimit={bodyLimit} />
            </p>
          )}
        </div>
      );
    }
    case 'safety': {
      const prefix = 'SAFETY · ';
      const lineLimit =
        limit === undefined ? undefined : limit > prefix.length ? limit - prefix.length : 0;
      return (
        <div className={styles.safety}>
          {limit !== undefined && limit < prefix.length ? (
            prefix.slice(0, limit)
          ) : (
            <>
              <span className={styles.safetyTag}>SAFETY ·</span>{' '}
            </>
          )}
          {(lineLimit === undefined || lineLimit > 0) && (
            <Lines lines={block.lines} plain={inReferences} charLimit={lineLimit} />
          )}
        </div>
      );
    }
    case 'cta':
      return (
        <p className={[styles.cta, styles.blockPull].join(' ')}>
          <Lines lines={block.lines} plain={inReferences} charLimit={limit} />
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
      const titleLimit = limit === undefined ? undefined : Math.min(limit, block.title.length);
      return (
        <details className={styles.box}>
          <summary className={styles.boxSummary}>
            <span className={styles.boxBracket} aria-hidden="true" />
            <span className={styles.boxTitle}>
              {titleLimit === undefined ? block.title : block.title.slice(0, titleLimit)}
            </span>
          </summary>
          <div
            className={[
              styles.boxBody,
              block.title.toLowerCase() === 'references' ? styles.referencesBox : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {block.blocks.map((sub, i) => (
              <Block
                key={i}
                block={sub}
                side={side}
                inBox
                inReferences={block.title.toLowerCase() === 'references'}
              />
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
  const isCover = page.id === 'cover';
  const hasToolkit = page.blocks.some((b) => b.kind === 'toolkit');
  const creditsChars = 52;

  const blockClass = (block: ZineBlock) =>
    [
      block.kind === 'source' ? styles.footerBlock : '',
      block.kind === 'cover' ? styles.coverBlock : '',
    ]
      .filter(Boolean)
      .join(' ');

  const inner = page.blocks.map((block, i) => (
    (() => {
      const instant =
        blockTypesInstant(block) ||
        (block.kind === 'box' && block.title.toLowerCase() === 'references');
      return (
    <TypedBlock
      key={`${page.id}-${i}`}
      index={i}
      charTotal={blockCharCount(block)}
      blockInstant={instant}
      className={blockClass(block)}
    >
      {({ charLimit }) => <Block block={block} side={side} charLimit={charLimit} />}
    </TypedBlock>
      );
    })()
  ));

  const footer =
    hasToolkit ? (
      <div className={styles.toolkitFooter}>
        <TypedBlock
          index={page.blocks.length}
          charTotal={creditsChars}
          className={styles.footerBlock}
        >
          {({ charLimit }) => <Credits charLimit={charLimit} />}
        </TypedBlock>
      </div>
    ) : null;

  if (page.alone) {
    return (
      <TypewriterProvider instant={isCover}>
        <PageAlone
          center={isCover ? false : page.center}
          vCenter={isCover ? false : page.vCenter}
          className={isCover ? styles.coverPage : undefined}
          style={page.bg ? { background: page.bg } : undefined}
        >
          {inner}
          {footer}
        </PageAlone>
      </TypewriterProvider>
    );
  }

  return (
    <TypewriterProvider instant={isCover}>
      <Page side={side} center={page.center} vCenter={page.vCenter}>
        {inner}
        {footer}
      </Page>
    </TypewriterProvider>
  );
}

function Credits({ charLimit }: { charLimit?: number }) {
  const plain = 'CC BY-NC-SA 4.0 · 2026 · Lukas Batschelet & Lukas Bauer';
  if (charLimit !== undefined && charLimit < plain.length) {
    return <div className={styles.credits}>{plain.slice(0, charLimit)}</div>;
  }

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

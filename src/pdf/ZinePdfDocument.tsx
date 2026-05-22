import { orgLinks, toolkitLinks } from '@/data/toolkit';
import { zineSpreads } from '@/content/zinePages';
import type { Line, Run, Tone, ZineBlock, ZinePageDef } from '@/content/types';
import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

Font.register({
  family: 'JetBrainsMono',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono@master/fonts/ttf/JetBrainsMono-Regular.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono@master/fonts/ttf/JetBrainsMono-Bold.ttf',
      fontWeight: 700,
    },
    {
      src: 'https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono@master/fonts/ttf/JetBrainsMono-Italic.ttf',
      fontWeight: 400,
      fontStyle: 'italic',
    },
  ],
});

const groupedToolkitLinks = toolkitLinks.reduce(
  (acc, tool) => {
    if (!acc[tool.key]) acc[tool.key] = [];
    acc[tool.key].push(tool);
    return acc;
  },
  {} as Record<string, typeof toolkitLinks>,
);

const s = StyleSheet.create({
  page: {
    fontFamily: 'JetBrainsMono',
    fontSize: 8,
    lineHeight: 1.45,
    padding: 22,
    backgroundColor: '#0a0a0a',
    color: '#c8c8c8',
  },
  pageWarm: { backgroundColor: '#161210' },
  pageCool: { backgroundColor: '#0d1410' },
  pageCover: {
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zh: { fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#f5b942' },
  zhCool: { color: '#d0e8d0' },
  zb: { fontSize: 8, lineHeight: 1.45, marginBottom: 6 },
  dim: { color: '#6f6f6f' },
  green: { color: '#98c379' },
  amber: { color: '#f5b942' },
  tag: { fontSize: 7, marginBottom: 8, letterSpacing: 1 },
  tagWarm: { color: '#e25b4a' },
  tagCool: { color: '#98c379' },
  bracket: { fontSize: 7, color: '#6f6f6f', marginBottom: 6 },
  step: { fontSize: 8, lineHeight: 1.45, marginBottom: 7 },
  stepLead: { fontWeight: 700, color: '#f0f0f0' },
  source: {
    fontSize: 6.5,
    color: '#6f6f6f',
    fontStyle: 'italic',
    marginTop: 10,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#3a2018',
  },
  safety: {
    fontSize: 8,
    color: '#c8c8c8',
    marginTop: 8,
    marginBottom: 8,
    padding: 6,
    borderLeftWidth: 1.5,
    borderLeftColor: '#e25b4a',
    backgroundColor: '#1a0f0c',
  },
  safetyTag: { color: '#e25b4a', fontWeight: 700, letterSpacing: 0.5 },
  cta: { fontSize: 16, fontWeight: 700, color: '#f5b942', marginTop: 12, marginBottom: 10, lineHeight: 1.2 },
  resourcebar: { fontSize: 7, color: '#6f6f6f', marginTop: 10, lineHeight: 1.5 },
  pullBig: { fontSize: 18, fontWeight: 700, color: '#f5b942', marginTop: 10, marginBottom: 10, lineHeight: 1.2 },
  pullNormal: { fontSize: 11, color: '#d0e8d0', marginTop: 8, marginBottom: 8, lineHeight: 1.3 },
  box: {
    marginTop: 8,
    padding: 6,
    borderWidth: 0.5,
    borderColor: '#1f3a2a',
    backgroundColor: '#0f1d15',
  },
  boxTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: '#98c379',
    letterSpacing: 0.5,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  coverTitle: { fontSize: 24, fontWeight: 700, color: '#f5b942', textAlign: 'center', marginBottom: 10 },
  coverSub: { fontSize: 9, color: '#6f6f6f', textAlign: 'center', marginBottom: 24 },
  coverBottom: { fontSize: 8, color: '#6f6f6f', textAlign: 'center', marginTop: 18 },
  toolkitH: { fontSize: 9, color: '#98c379', marginTop: 10, marginBottom: 4 },
  link: { color: '#56b6c2' },
  credits: { fontSize: 6, color: '#6f6f6f', marginTop: 18, lineHeight: 1.4 },
  creditsLink: { color: '#6f6f6f', textDecoration: 'none' },
});

const toneStyle = StyleSheet.create({
  white: { color: '#ffffff' },
  amber: { color: '#f5b942' },
  red: { color: '#e25b4a' },
  green: { color: '#98c379' },
  cyan: { color: '#56b6c2' },
  dim: { color: '#6f6f6f' },
  redact: { backgroundColor: '#3a3a3a', color: '#3a3a3a' },
  hlRed: { backgroundColor: '#e25b4a', color: '#161210' },
  bold: { fontWeight: 700, color: '#f0f0f0' },
  italic: { fontStyle: 'italic', color: '#56b6c2' },
}) as Record<Tone, { color: string; backgroundColor?: string; fontWeight?: 700; fontStyle?: 'italic' }>;

/** Same lightweight markdown as the web renderer: **bold** and *italic*. */
function parseMd(str: string): (string | { text: string; tone: Tone })[] {
  const out: (string | { text: string; tone: Tone })[] = [];
  const re = /\*\*([^*]+?)\*\*|\*([^*]+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) out.push(str.slice(last, m.index));
    if (m[1] !== undefined) out.push({ text: m[1], tone: 'bold' });
    else if (m[2] !== undefined) out.push({ text: m[2], tone: 'italic' });
    last = re.lastIndex;
  }
  if (last < str.length) out.push(str.slice(last));
  return out.length === 0 ? [str] : out;
}

function renderPiece(piece: string | { text: string; tone: Tone }, key: number) {
  if (typeof piece === 'string') return piece;
  return (
    <Text key={key} style={toneStyle[piece.tone]}>
      {piece.text}
    </Text>
  );
}

function renderRun(run: Run, key: number) {
  if (typeof run === 'string') {
    return parseMd(run).map((p, j) => renderPiece(p, key * 100 + j));
  }
  return renderPiece(run, key);
}

function renderLines(lines: Line[]) {
  const out: React.ReactNode[] = [];
  lines.forEach((line, i) => {
    if (i > 0) out.push('\n');
    if (typeof line === 'string') {
      const pieces = parseMd(line);
      pieces.forEach((p, j) => out.push(renderPiece(p, i * 1000 + j)));
    } else {
      line.forEach((run, j) => {
        const rendered = renderRun(run, i * 1000 + j);
        if (Array.isArray(rendered)) rendered.forEach((r) => out.push(r));
        else out.push(rendered);
      });
    }
  });
  return out;
}

function PdfBlock({ block, cool }: { block: ZineBlock; cool?: boolean }) {
  switch (block.kind) {
    case 'cover':
      return (
        <View>
          <Text style={s.coverTitle}>ESCAPING{'\n'}THE PANOPTICON</Text>
          <Text style={s.coverSub}>
            a zine on AI, state surveillance{'\n'}& digital self-defense
          </Text>
          <Text style={s.coverBottom}>Who gets watched is never an accident.</Text>
        </View>
      );
    case 'toolkit':
      return (
        <View>
          <Text style={s.toolkitH}>// toolkit</Text>
          {Object.entries(groupedToolkitLinks).map(([key, tools]) => (
            <Text key={key} style={s.zb}>
              {key} →{' '}
              {tools.map((t, i) => (
                <Text key={`${t.key}-${t.label}`}>
                  {i > 0 ? ', ' : ''}
                  <Link src={t.href} style={s.link}>
                    {t.label}
                  </Link>
                </Text>
              ))}
            </Text>
          ))}
          <Text style={s.toolkitH}>// learn more</Text>
          {orgLinks.map((o) => (
            <Text key={o.href} style={s.zb}>
              <Link src={o.href} style={s.link}>
                {o.label}
              </Link>
            </Text>
          ))}
          <Text style={s.credits}>
            <Link src="https://creativecommons.org/licenses/by-nc-sa/4.0/" style={s.creditsLink}>
              CC BY-NC-SA 4.0
            </Link>
            {' · 2026 · '}
            <Link src="https://lukasbatschelet.ch" style={s.creditsLink}>
              Lukas Batschelet
            </Link>
            {' & Lukas Bauer'}
          </Text>
        </View>
      );
    case 'tag':
      return (
        <Text style={[s.tag, block.variant === 'warm' ? s.tagWarm : s.tagCool]}>
          {block.rec ? '● ' : ''}
          {block.text}
        </Text>
      );
    case 'h':
      return <Text style={cool ? [s.zh, s.zhCool] : s.zh}>{renderLines(block.lines)}</Text>;
    case 'p': {
      const toneArr =
        block.tone === 'dim'
          ? [s.zb, s.dim]
          : block.tone === 'green'
            ? [s.zb, s.green]
            : block.tone === 'amber'
              ? [s.zb, s.amber]
              : s.zb;
      return <Text style={toneArr}>{renderLines(block.lines)}</Text>;
    }
    case 'pull':
      return (
        <Text style={block.size === 'big' ? s.pullBig : s.pullNormal}>
          {renderLines(block.lines)}
          {block.sub ? `\n${block.sub}` : ''}
        </Text>
      );
    case 'step':
      return (
        <Text style={s.step}>
          <Text style={s.stepLead}>{block.lead}</Text> {renderLines(block.body)}
        </Text>
      );
    case 'source':
      return <Text style={s.source}>{renderLines([block.text])}</Text>;
    case 'safety':
      return (
        <Text style={s.safety}>
          <Text style={s.safetyTag}>SAFETY ·</Text> {renderLines(block.lines)}
        </Text>
      );
    case 'cta':
      return <Text style={s.cta}>{renderLines(block.lines)}</Text>;
    case 'resourcebar':
      return (
        <Text style={s.resourcebar}>
          {block.items.map((item, i) => (
            <Text key={item.label}>
              {i > 0 ? ' · ' : ''}
              {item.href ? (
                <Link src={item.href} style={s.link}>
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </Text>
          ))}
        </Text>
      );
    case 'bottomline':
      return <Text style={s.coverBottom}>{block.text}</Text>;
    case 'bracket':
      return <Text style={s.bracket}>{block.text}</Text>;
    case 'box':
      return (
        <View style={s.box}>
          <Text style={s.boxTitle}>{block.title}</Text>
          {block.blocks.map((sub, i) => (
            <PdfBlock key={i} block={sub} cool={cool} />
          ))}
        </View>
      );
    default:
      return null;
  }
}

function PdfPageContent({ page, cool }: { page: ZinePageDef; cool?: boolean }) {
  return (
    <>
      {page.blocks.map((block, i) => (
        <PdfBlock key={`${page.id}-${i}`} block={block} cool={cool} />
      ))}
    </>
  );
}

type PdfPageEntry = {
  page: ZinePageDef;
  cool?: boolean;
  style: (typeof s)[keyof typeof s];
};

function printPages(): PdfPageEntry[] {
  const pages: PdfPageEntry[] = [];
  for (const spread of zineSpreads) {
    const leftStyle = spread.left.alone
      ? spread.left.bg
        ? { ...s.page, backgroundColor: spread.left.bg }
        : s.pageCover
      : spread.right
        ? s.pageWarm
        : s.page;
    pages.push({
      page: spread.left,
      cool: Boolean(spread.right),
      style: leftStyle,
    });
    if (spread.right) {
      pages.push({ page: spread.right, cool: true, style: s.pageCool });
    }
  }
  return pages;
}

export function ZinePdfDocument() {
  return (
    <Document title="escaping the panopticon" author="versteckis.ch">
      {printPages().map(({ page, cool, style }, i) => (
        <Page key={`${page.id}-${i}`} size="A5" style={style}>
          <PdfPageContent page={page} cool={cool} />
        </Page>
      ))}
    </Document>
  );
}

export type Tone =
  | 'white'
  | 'amber'
  | 'red'
  | 'green'
  | 'cyan'
  | 'dim'
  | 'redact'
  | 'hlRed'
  | 'bold'
  | 'italic';

/** An inline piece of a line: either plain text, or text with a tone. */
export type Run = string | { text: string; tone: Tone };

/**
 * A line is either plain text or a sequence of coloured runs.
 *
 * Plain strings are auto-parsed for **bold** and *italic* markdown at render
 * time. Strings inside Run arrays are also parsed. Use the explicit
 * { text, tone } form for colour highlights.
 */
export type Line = string | Run[];

export type ZineBlock =
  // labels & headings
  | { kind: 'tag'; variant: 'warm' | 'cool'; text: string; rec?: boolean }
  | { kind: 'h'; lines: Line[] }
  // prose
  | { kind: 'p'; lines: Line[]; tone?: 'dim' | 'green' | 'amber' | 'default' }
  | { kind: 'pull'; lines: Line[]; sub?: string; size?: 'normal' | 'big' }
  | { kind: 'step'; lead: string; body: Line[] }
  | { kind: 'source'; text: string }
  | { kind: 'callout'; lines: Line[]; title?: string }
  | { kind: 'safety'; lines: Line[] }
  | { kind: 'cta'; lines: Line[] }
  | { kind: 'resourcebar'; items: { label: string; href?: string }[] }
  | { kind: 'bottomline'; text: string }
  // structural
  | { kind: 'bracket'; text: string }
  | { kind: 'box'; title: string; blocks: ZineBlock[] }
  // one-off pages
  | { kind: 'cover' }
  | { kind: 'toolkit' };

export type ZinePageDef = {
  id: string;
  blocks: ZineBlock[];
  /** Horizontal + vertical center (cover, etc.) */
  center?: boolean;
  /** Vertical center only; text alignment unchanged */
  vCenter?: boolean;
  alone?: boolean;
  bg?: string;
};

export type ZineSpreadDef = {
  id: string;
  layout?: 'single' | 'spread';
  left: ZinePageDef;
  right?: ZinePageDef;
};

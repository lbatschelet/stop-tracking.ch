import type { Line, Run, ZineBlock } from './types';

function runLength(run: Run): number {
  return typeof run === 'string' ? run.length : run.text.length;
}

export function lineLength(line: Line): number {
  return typeof line === 'string' ? line.length : line.reduce((sum, run) => sum + runLength(run), 0);
}

export function linesCharCount(lines: Line[]): number {
  return lines.reduce((sum, line, i) => sum + lineLength(line) + (i > 0 ? 1 : 0), 0);
}

export function sourceVisibleText(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)(?:\s+"[^"]*")?\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
}

export function blockCharCount(block: ZineBlock): number {
  switch (block.kind) {
    case 'h':
    case 'p':
    case 'cta':
      return linesCharCount(block.lines);
    case 'safety':
      return linesCharCount(block.lines) + 9;
    case 'pull': {
      let n = linesCharCount(block.lines);
      if (block.sub) n += 1 + block.sub.length;
      return n;
    }
    case 'tag':
      return block.text.length + (block.rec ? 4 : 0);
    case 'step':
      return block.lead.length + 1 + linesCharCount(block.body);
    case 'source':
      return sourceVisibleText(block.text).length;
    case 'callout': {
      const titleLen = block.title?.trim().length ?? 0;
      const linesLen = block.lines.reduce((sum, line, i) => {
        let n = lineLength(line);
        if (typeof line === 'string') {
          const bulletMatch = line.match(/^\s*-\s+(.*)$/);
          if (bulletMatch) n = bulletMatch[1].length;
        }
        return sum + n + (i > 0 ? 1 : 0);
      }, 0);
      return linesLen + (titleLen > 0 ? titleLen + 1 : 0);
    }
    case 'bottomline':
    case 'bracket':
      return block.text.length;
    case 'resourcebar':
      return block.items.reduce(
        (sum, item, i) => sum + item.label.length + (i > 0 ? 3 : 0),
        0,
      );
    case 'box':
      return block.title.length;
    default:
      return 0;
  }
}

/** Blocks that appear instantly when their turn arrives (no char typing). */
export function blockTypesInstant(block: ZineBlock): boolean {
  return block.kind === 'cover' || block.kind === 'toolkit';
}

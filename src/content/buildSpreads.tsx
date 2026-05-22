import type { ZinePage } from '@/types/zine';
import { WebPage } from './WebPage';
import { zineSpreads } from './zinePages';

/** Flache Seitenliste für die Web-Ansicht (jede linke/rechte Heftseite = eine View). */
export function buildZinePages(): ZinePage[] {
  const pages: ZinePage[] = [];

  for (const def of zineSpreads) {
    pages.push({
      id: def.left.id,
      content: <WebPage page={def.left} side="left" />,
    });
    if (def.layout !== 'single' && def.right) {
      pages.push({
        id: def.right.id,
        content: <WebPage page={def.right} side="right" />,
      });
    }
  }

  return pages;
}

'use client';

import { downloadZinePdf } from '@/pdf/downloadZinePdf';
import { useCallback, useState, type MouseEvent } from 'react';
import styles from './zine.module.css';

export function DownloadPdfLink() {
  const [busy, setBusy] = useState(false);

  const onClick = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (busy) return;
      setBusy(true);
      try {
        await downloadZinePdf();
      } finally {
        setBusy(false);
      }
    },
    [busy],
  );

  return (
    <button
      type="button"
      className={styles.zineLink}
      onClick={onClick}
      disabled={busy}
      style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: busy ? 'wait' : 'pointer' }}
    >
      {busy ? 'generating pdf…' : 'download pdf'}
    </button>
  );
}

'use client';

import { pdf } from '@react-pdf/renderer';
import { ZinePdfDocument } from './ZinePdfDocument';

export async function downloadZinePdf() {
  const blob = await pdf(<ZinePdfDocument />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'versteckis-zine.pdf';
  a.click();
  URL.revokeObjectURL(url);
}

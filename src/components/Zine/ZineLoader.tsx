'use client';

import dynamic from 'next/dynamic';

const Zine = dynamic(() => import('./index'), {
  ssr: false,
});

export default function ZineLoader() {
  return <Zine />;
}

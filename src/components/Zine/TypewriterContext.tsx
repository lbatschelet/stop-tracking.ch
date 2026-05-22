'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type TypewriterContextValue = {
  activeBlock: number;
  instant: boolean;
  completeBlock: (index: number) => void;
};

const TypewriterContext = createContext<TypewriterContextValue | null>(null);

export function TypewriterProvider({
  instant,
  children,
}: {
  instant?: boolean;
  children: ReactNode;
}) {
  const [activeBlock, setActiveBlock] = useState(0);

  const completeBlock = useCallback((index: number) => {
    setActiveBlock((current) => Math.max(current, index + 1));
  }, []);

  const value = useMemo(
    () => ({
      activeBlock: instant ? Number.MAX_SAFE_INTEGER : activeBlock,
      instant: !!instant,
      completeBlock,
    }),
    [activeBlock, completeBlock, instant],
  );

  return <TypewriterContext.Provider value={value}>{children}</TypewriterContext.Provider>;
}

export function useTypewriter() {
  const ctx = useContext(TypewriterContext);
  if (!ctx) {
    throw new Error('useTypewriter must be used within TypewriterProvider');
  }
  return ctx;
}

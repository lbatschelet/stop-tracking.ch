export const pdf = () => ({
  toBlob: async () => new Blob(),
});

export const Document = ({ children }: { children?: unknown }) => children;
export const Page = ({ children }: { children?: unknown }) => children;
export const Text = ({ children }: { children?: unknown }) => children;
export const View = ({ children }: { children?: unknown }) => children;
export const StyleSheet = { create: (s: Record<string, unknown>) => s };
export const Font = { register: () => {} };

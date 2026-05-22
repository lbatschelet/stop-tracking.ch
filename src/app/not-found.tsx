import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        background: '#0a0a0a',
        color: '#98c379',
        gap: '1rem',
      }}
    >
      <p>404 — page not found</p>
      <Link href="/" style={{ color: '#c8c8c8' }}>
        ← back to the zine
      </Link>
    </main>
  );
}

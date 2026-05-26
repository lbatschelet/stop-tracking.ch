import Link from 'next/link';
import { ResourceNavIcon } from '@/components/ResourceNavIcon';
import { resourceActions, type ResourceActionId } from '@/data/resourceNav';
import styles from '@/app/resource-pages.module.css';

export function ResourcePageLayout({
  title,
  activeId,
  children,
}: {
  title: string;
  activeId: ResourceActionId;
  children: React.ReactNode;
}) {
  return (
    <main className={styles.page}>
      <div className={styles.stage}>
        <div className={styles.pageViewport}>
          <div className={styles.frameWithActions}>
            <article className={styles.content}>
            <h1 className={styles.title}>{title}</h1>
            {children}
          </article>
          <nav className={styles.resourceNav} aria-label="Resource pages">
          <Link
            className={styles.navButton}
            href="/"
            aria-label="Back to the zine"
            data-label="Back to the zine"
          >
            <svg viewBox="0 0 24 24" className={styles.navIconSvg} aria-hidden="true">
              <path d="M14 6 8 12l6 6" />
            </svg>
          </Link>
          {resourceActions.map((action) => {
            const isActive = action.id === activeId;
            const className = [styles.navButton, isActive ? styles.navButtonActive : '']
              .filter(Boolean)
              .join(' ');

            if (action.external) {
              return (
                <a
                  key={action.id}
                  className={className}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={action.label}
                  data-label={action.label}
                >
                  <ResourceNavIcon id={action.id} className={styles.navIconSvg} />
                </a>
              );
            }

            return (
              <Link
                key={action.id}
                className={className}
                href={action.href}
                aria-label={action.label}
                aria-current={isActive ? 'page' : undefined}
                data-label={action.label}
              >
                <ResourceNavIcon id={action.id} className={styles.navIconSvg} />
              </Link>
            );
          })}
          </nav>
          </div>
        </div>
      </div>
    </main>
  );
}

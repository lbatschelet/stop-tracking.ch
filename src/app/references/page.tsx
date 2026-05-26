import { ResourcePageLayout } from '@/components/ResourcePageLayout';
import { references } from '@/data/references';
import styles from '../resource-pages.module.css';

export default function ReferencesPage() {
  return (
    <ResourcePageLayout title="References" activeId="references">
      {references.map((entry) => (
        <p key={entry.citation} className={styles.hanging}>
          {entry.citation}{' '}
          <a className={styles.linkInline} href={entry.href} target="_blank" rel="noopener noreferrer">
            {entry.href}
          </a>
        </p>
      ))}
    </ResourcePageLayout>
  );
}

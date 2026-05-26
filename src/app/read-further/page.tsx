import { ResourcePageLayout } from '@/components/ResourcePageLayout';
import { orgLinks } from '@/data/toolkit';
import styles from '../resource-pages.module.css';

export default function ReadFurtherPage() {
  return (
    <ResourcePageLayout title="Learn more" activeId="learn-more">
      <p className={styles.text}>
        Organizations whose work aligns with the themes in this zine — surveillance, digital rights,
        and practical self-defense.
      </p>
      {orgLinks.map((org) => (
        <p key={org.href} className={styles.hanging}>
          <a className={styles.linkInline} href={org.href} target="_blank" rel="noopener noreferrer">
            {org.label}
          </a>
        </p>
      ))}
    </ResourcePageLayout>
  );
}

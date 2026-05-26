import { ResourcePageLayout } from '@/components/ResourcePageLayout';
import { toolkitLinks } from '@/data/toolkit';
import styles from '../resource-pages.module.css';

export default function ToolboxPage() {
  const grouped = toolkitLinks.reduce<Record<string, typeof toolkitLinks>>((acc, item) => {
    if (!acc[item.key]) acc[item.key] = [];
    acc[item.key].push(item);
    return acc;
  }, {});

  return (
    <ResourcePageLayout title="Toolbox" activeId="toolbox">
      <p className={styles.text}>
        A curated collection of tools mentioned in the zine — browsers, blockers, VPNs, messaging,
        passwords, and more. Recommendations change: projects update, policies shift, and what was
        solid last year may not be today. Treat this list as a starting point, not a permanent
        verdict.
      </p>
      <p className={styles.text}>
        This site does not track you. Once you follow a link below, you leave this site — and most
        tool vendors run their own analytics, cookies, or sign-up flows. Open links deliberately.
      </p>
      {Object.entries(grouped).map(([key, items]) => (
        <p key={key} className={styles.text}>
          <strong>{key}</strong>:{' '}
          {items.map((item, i) => (
            <span key={item.href}>
              {i > 0 && ', '}
              <a className={styles.linkInline} href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            </span>
          ))}
        </p>
      ))}
    </ResourcePageLayout>
  );
}

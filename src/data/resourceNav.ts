export const resourceActions = [
  {
    id: 'toolbox',
    label: 'Toolbox',
    href: '/toolbox',
  },
  {
    id: 'learn-more',
    label: 'Learn more',
    href: '/read-further',
  },
  {
    id: 'references',
    label: 'References',
    href: '/references',
  },
  {
    id: 'source-code',
    label: 'Source code',
    href: 'https://github.com/lbatschelet/stop-tracking.ch',
    external: true,
  },
] as const;

export type ResourceActionId = (typeof resourceActions)[number]['id'];

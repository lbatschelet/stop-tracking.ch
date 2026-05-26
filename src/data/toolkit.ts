export type ToolkitLink = {
  key: string;
  label: string;
  href: string;
};

export const toolkitLinks: ToolkitLink[] = [
  { key: 'browser', label: 'Firefox', href: 'https://www.mozilla.org/firefox/' },
  { key: 'browser', label: 'Brave', href: 'https://brave.com/' },
  { key: 'browser', label: 'Vivaldi', href: 'https://vivaldi.com/' },
  { key: 'browser', label: 'Mullvad Browser', href: 'https://mullvad.net/en/browser' },
  { key: 'block', label: 'uBlock Origin', href: 'https://ublockorigin.com/' },
  { key: 'search', label: 'DuckDuckGo', href: 'https://duckduckgo.com/' },
  { key: 'search', label: 'Startpage', href: 'https://www.startpage.com/' },
  { key: 'vpn', label: 'Mullvad', href: 'https://mullvad.net/' },
  { key: 'vpn', label: 'Proton VPN', href: 'https://protonvpn.com/' },
  { key: 'email', label: 'Proton Mail', href: 'https://proton.me/mail' },
  { key: 'messages', label: 'Signal', href: 'https://signal.org/' },
  { key: 'messages', label: 'Threema', href: 'https://threema.ch/' },
  { key: 'passwords', label: 'Bitwarden', href: 'https://bitwarden.com/' },
  { key: 'passwords', label: 'KeePassXC', href: 'https://keepassxc.org/' },
  { key: 'passwords', label: 'Proton Pass', href: 'https://proton.me/pass' },
  { key: 'aliases', label: 'SimpleLogin', href: 'https://simplelogin.io/' },
  { key: 'aliases', label: 'Addy', href: 'https://addy.io/' },
  { key: 'network', label: 'Pi-hole', href: 'https://pi-hole.net/' },
  { key: 'cycle', label: 'Euki', href: 'https://eukiapp.com/' },
];

export const orgLinks: { label: string; href: string }[] = [
  { label: 'Digitale Gesellschaft', href: 'https://www.digitale-gesellschaft.ch/' },
  { label: 'grundrechte.ch', href: 'https://grundrechte.ch/' },
  { label: 'Amnesty Switzerland', href: 'https://www.amnesty.ch/de/themen/uberwachung' },
  { label: 'Coalition Against Stalkerware', href: 'https://stopstalkerware.org/' },
  { label: 'EFF Surveillance Self-Defense', href: 'https://ssd.eff.org/' },
];

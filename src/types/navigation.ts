export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Experience', href: '/experience' },
  { label: 'Contact', href: '/contact' },
];

export const BRAND_TAGLINE = 'Software Developer • Leader • Following Christ';
export const CORE_MESSAGE = 'I build software, learn in public, and share the journey.';

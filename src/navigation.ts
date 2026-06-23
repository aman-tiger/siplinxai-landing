import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Features',
      href: getPermalink('/#features'),
    },
    {
      text: 'How it Works',
      href: getPermalink('/#how-it-works'),
    },
    {
      text: 'Pricing',
      href: getPermalink('/pricing'),
    },
    {
      text: 'Resources',
      links: [
        { text: 'Help Center', href: getPermalink('/help') },
        { text: 'Security', href: getPermalink('/security') },
        { text: 'Press', href: getPermalink('/press') },
        { text: 'Careers', href: getPermalink('/careers') },
        { text: 'Blog', href: getBlogPermalink() },
      ],
    },
  ],
  actions: [
    {
      variant: 'primary' as const,
      text: 'Download Free',
      href: 'https://siplinx-ai.vercel.app/download',
      icon: 'tabler:download',
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Product',
      links: [
        { text: 'Features', href: '/#features' },
        { text: 'How it Works', href: '/#how-it-works' },
        { text: 'Pricing', href: '/pricing' },
        { text: 'Download', href: '/download' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '/about' },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Careers', href: '/careers' },
        { text: 'Press', href: '/press' },
        { text: 'Contact', href: '/contact' },
        { text: 'Privacy Policy', href: '/privacy' },
        { text: 'Terms', href: '/terms' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Help Center', href: '/help' },
        { text: 'Security', href: '/security' },
        { text: 'Community', href: '#' },
        { text: 'Status', href: '#' },
        { text: 'Contact Us', href: '/contact' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: '#' },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: '#' },
  ],
  footNote: `
    © ${new Date().getFullYear()} <a class="bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent font-semibold" href="/">Siplinx AI</a> · All rights reserved.
  `,
};

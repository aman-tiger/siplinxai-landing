import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

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
      text: 'Blog',
      href: getBlogPermalink(),
    },
  ],
  actions: [
    {
      variant: 'primary',
      text: 'Download Free',
      href: '/download',
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
        { text: 'Changelog', href: '#' },
      ],
    },
    {
      title: 'Integrations',
      links: [
        { text: 'Zoom', href: '#' },
        { text: 'Google Meet', href: '#' },
        { text: 'Microsoft Teams', href: '#' },
        { text: 'Webex', href: '#' },
        { text: 'Slack', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '/about' },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Contact', href: '/contact' },
        { text: 'Privacy Policy', href: '/privacy' },
        { text: 'Terms', href: '/terms' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Documentation', href: '#' },
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
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: '#' },
  ],
  footNote: `
    © ${new Date().getFullYear()} <a class="text-purple-600 underline dark:text-purple-400" href="/">SipLinxAI</a> · All rights reserved.
  `,
};

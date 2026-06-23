import { getPermalink, getBlogPermalink } from '~/utils/permalinks';

export const headerDataRu = {
  links: [
    { text: 'Возможности', href: getPermalink('/ru/#features') },
    { text: 'Как это работает', href: getPermalink('/ru/#how-it-works') },
    { text: 'Цены', href: getPermalink('/ru/pricing') },
    { text: 'Блог', href: getBlogPermalink() },
  ],
  actions: [
    {
      variant: 'primary' as const,
      text: 'Скачать бесплатно',
      href: 'https://siplinx-ai.vercel.app/download',
      icon: 'tabler:download',
    },
  ],
};

export const footerDataRu = {
  links: [
    {
      title: 'Продукт',
      links: [
        { text: 'Возможности', href: '/ru/#features' },
        { text: 'Как это работает', href: '/ru/#how-it-works' },
        { text: 'Цены', href: '/ru/pricing' },
        { text: 'Скачать', href: '/ru/download' },
      ],
    },
    {
      title: 'Компания',
      links: [
        { text: 'О нас', href: '/ru/about' },
        { text: 'Блог', href: getBlogPermalink() },
        { text: 'Контакты', href: '/ru/contact' },
        { text: 'Политика конфиденциальности', href: '/privacy' },
        { text: 'Условия', href: '/terms' },
      ],
    },
    {
      title: 'Поддержка',
      links: [
        { text: 'Документация', href: '#' },
        { text: 'Сообщество', href: '#' },
        { text: 'Статус', href: '#' },
        { text: 'Связаться с нами', href: '/ru/contact' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Условия', href: getPermalink('/terms') },
    { text: 'Политика конфиденциальности', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: '#' },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: '#' },
  ],
  footNote: `
    © ${new Date().getFullYear()} <a class="bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent font-semibold" href="/ru">Siplinx AI</a> · Все права защищены.
  `,
};

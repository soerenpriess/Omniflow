import type { Category } from '@/types/Category'

export const welcomeCategory: Category = {
  title: 'Welcome to Omniflow',
  hoverColor: '#38BDF8', // sky blue
  waveDesign: {
    waveColors: ['#38BDF826', '#7DD3FC1F', '#BAE6FD14'],
    waveHeights: [10, 6, 5],
    waveAmplitudes: [1, -2, -3],
  },
  cards: [
    {
      title: 'What is Omniflow?',
      icon: 'mdi:information-outline',
      description:
        'A comprehensive collection of useful online tools that run completely in your browser. No installation, no registration - just use them!',
      path: '/welcome/about',
      isActive: true,
      isFavoritable: false,
    },
    {
      title: 'Privacy First',
      icon: 'mdi:shield-lock-outline',
      description:
        'All tools run 100% client-side. Your data never leaves your computer and is not stored or transmitted anywhere.',
      path: '/welcome/privacy',
      isActive: true,
      isFavoritable: false,
    },
    {
      title: 'Free & Open Source',
      icon: 'mdi:open-source-initiative',
      description:
        'Completely free to use with no hidden costs. The source code is open and transparent for everyone to see.',
      path: '/welcome/open-source',
      isActive: true,
      isFavoritable: false,
    },
    {
      title: 'Features',
      icon: 'mdi:feature-search-outline',
      description:
        'From calculators to cryptography to image and PDF tools - discover versatile utilities for your daily needs.',
      path: '/welcome/features',
      isActive: true,
      isFavoritable: false,
    },
  ],
}

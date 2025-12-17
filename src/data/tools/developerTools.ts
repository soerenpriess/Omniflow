import type { Category } from '@/types/Category'

export const developerToolsCategory: Category = {
  title: 'Developer Tools',
  hoverColor: '#8B5CF6',
  waveDesign: {
    waveColors: ['rgba(139,92,246,0.3)', 'rgba(139,92,246,0.15)', 'rgba(139,92,246,0.05)'],
    waveHeights: [10, 25, 50],
    waveAmplitudes: [8, 10, 12],
  },
  cards: [
    {
      title: 'HTTP Status Code Lookup',
      icon: 'mdi:web',
      description: 'Look up HTTP status codes and their meanings.',
      path: '/developerTools/httpStatusLookup',
      isActive: true,
    },
    {
      title: 'Chmod Calculator',
      icon: 'mdi:shield-lock',
      description: 'Calculate Unix file permissions easily.',
      path: '/developerTools/chmodCalculator',
      isActive: true,
    },
    {
      title: 'Code Minifier',
      icon: 'mdi:code-braces',
      description: 'Minify JavaScript, CSS, and HTML code.',
      path: '/developerTools/codeMinifier',
      isActive: true,
    },
    {
      title: 'Git Commands Cheatsheet',
      icon: 'mdi:git',
      description: 'Essential Git commands with examples.',
      path: '/developerTools/gitCheatsheet',
      isActive: true,
    },
    {
      title: 'Cron Expression Generator',
      icon: 'mdi:calendar-clock',
      description: 'Create cron expressions visually for scheduling.',
      path: '/developerTools/cronGenerator',
      isActive: true,
    },
  ],
}

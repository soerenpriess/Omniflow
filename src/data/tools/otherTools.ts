import type { Category } from '@/types/Category'

export const otherToolsCategory: Category = {
  title: 'Other Tools',
  hoverColor: '#F59E0B',
  waveDesign: {
    waveColors: ['rgba(255,255,0,0.3)', 'rgba(255,255,0,0.15)', 'rgba(255,255,0,0.05)'],
    waveHeights: [10, 6, 5],
    waveAmplitudes: [1, -2, -3],
  },
  cards: [
    {
      title: 'Spin the Wheel',
      icon: 'mdi:wheel',
      description: 'Spin a virtual wheel for random selections.',
      path: '/other/spinTheWheel',
      isActive: true,
    },
    {
      title: 'Timer & Stopwatch',
      icon: 'mdi:timer',
      description: 'Track time with countdown or stopwatch.',
      path: '/other/timerStopwatch',
      isActive: true,
    },
    {
      title: 'Random Name Generator',
      icon: 'mdi:account-question',
      description: 'Generate random names for testing.',
      path: '/other/randomNameGenerator',
      isActive: true,
    },
    {
      title: 'Dice Roller',
      icon: 'mdi:dice-6',
      description: 'Roll virtual dice for games and decisions.',
      path: '/other/diceRoller',
      isActive: true,
    },
    {
      title: 'Coin Flip Simulator',
      icon: 'mdi:cash-multiple',
      description: 'Flip a virtual coin and track results.',
      path: '/other/coinFlip',
      isActive: true,
    },
    {
      title: 'Rock Paper Scissors',
      icon: 'mdi:hand-back-right',
      description: 'Play rock paper scissors against the computer.',
      path: '/other/rockPaperScissors',
      isActive: true,
    },
    {
      title: 'Typing Speed Test',
      icon: 'mdi:keyboard',
      description: 'Test your typing speed and accuracy.',
      path: '/other/typingSpeedTest',
      isActive: true,
    },
    {
      title: 'Reaction Time Tester',
      icon: 'mdi:clock-fast',
      description: 'Test your reaction time with quick challenges.',
      path: '/other/reactionTime',
      isActive: true,
    },
    {
      title: 'Decision Maker',
      icon: 'mdi:help-circle',
      description: 'Get random answers for your decisions.',
      path: '/other/decisionMaker',
      isActive: true,
    },
    {
      title: 'Audio Trimmer',
      icon: 'mdi:content-cut',
      description: 'Trim and cut audio files in your browser.',
      path: '/other/audioTrimmer',
      isActive: true,
    },
  ],
}

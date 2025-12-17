import type { RouteRecordRaw } from 'vue-router'
import SpinningWheel from '@/views/SpinningWheel.vue'
import TimerStopwatch from '@/views/TimerStopwatch.vue'
import RandomNameGenerator from '@/views/RandomNameGenerator.vue'
import DiceRoller from '@/views/DiceRoller.vue'
import CoinFlip from '@/views/CoinFlip.vue'
import RockPaperScissors from '@/views/RockPaperScissors.vue'
import TypingSpeedTest from '@/views/TypingSpeedTest.vue'
import ReactionTime from '@/views/ReactionTime.vue'
import DecisionMaker from '@/views/DecisionMaker.vue'
import AudioTrimmer from '@/views/AudioTrimmer.vue'

export const otherRoutes: RouteRecordRaw[] = [
  {
    path: '/other/spinTheWheel',
    name: 'SpinningWheel',
    component: SpinningWheel,
    meta: { isFavoritable: true },
  },
  {
    path: '/other/timerStopwatch',
    name: 'TimerStopwatch',
    component: TimerStopwatch,
    meta: { isFavoritable: true },
  },
  {
    path: '/other/randomNameGenerator',
    name: 'RandomNameGenerator',
    component: RandomNameGenerator,
    meta: { isFavoritable: true },
  },
  {
    path: '/other/diceRoller',
    name: 'DiceRoller',
    component: DiceRoller,
    meta: { isFavoritable: true },
  },
  {
    path: '/other/coinFlip',
    name: 'coinFlip',
    component: CoinFlip,
    meta: { isFavoritable: true },
  },
  {
    path: '/other/rockPaperScissors',
    name: 'rockPaperScissors',
    component: RockPaperScissors,
    meta: { isFavoritable: true },
  },
  {
    path: '/other/typingSpeedTest',
    name: 'typingSpeedTest',
    component: TypingSpeedTest,
    meta: { isFavoritable: true },
  },
  {
    path: '/other/reactionTime',
    name: 'reactionTime',
    component: ReactionTime,
    meta: { isFavoritable: true },
  },
  {
    path: '/other/decisionMaker',
    name: 'decisionMaker',
    component: DecisionMaker,
    meta: { isFavoritable: true },
  },
  {
    path: '/other/audioTrimmer',
    name: 'audioTrimmer',
    component: AudioTrimmer,
    meta: { isFavoritable: true },
  },
]

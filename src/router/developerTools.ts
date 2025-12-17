import type { RouteRecordRaw } from 'vue-router'
import HttpStatusLookup from '@/views/DeveloperTools/HttpStatusLookup.vue'
import ChmodCalculator from '@/views/DeveloperTools/ChmodCalculator.vue'
import CodeMinifier from '@/views/DeveloperTools/CodeMinifier.vue'
import GitCheatsheet from '@/views/DeveloperTools/GitCheatsheet.vue'
import CronGenerator from '@/views/DeveloperTools/CronGenerator.vue'

export const developerToolsRoutes: RouteRecordRaw[] = [
  {
    path: '/developerTools/httpStatusLookup',
    name: 'httpStatusLookup',
    component: HttpStatusLookup,
    meta: { isFavoritable: true },
  },
  {
    path: '/developerTools/chmodCalculator',
    name: 'chmodCalculator',
    component: ChmodCalculator,
    meta: { isFavoritable: true },
  },
  {
    path: '/developerTools/codeMinifier',
    name: 'codeMinifier',
    component: CodeMinifier,
    meta: { isFavoritable: true },
  },
  {
    path: '/developerTools/gitCheatsheet',
    name: 'GitCheatsheet',
    component: GitCheatsheet,
    meta: { isFavoritable: true },
  },
  {
    path: '/developerTools/cronGenerator',
    name: 'CronGenerator',
    component: CronGenerator,
    meta: { isFavoritable: true },
  },
]

import type { RouteRecordRaw } from 'vue-router'
import About from '../views/Legal/About.vue'
import Imprint from '../views/Legal/Imprint.vue'
import PrivacyPolicy from '../views/Legal/PrivacyPolicy.vue'

export const legalRoutes: RouteRecordRaw[] = [
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { showHeader: false },
  },
  {
    path: '/imprint',
    name: 'Imprint',
    component: Imprint,
    meta: { showHeader: false },
  },
  {
    path: '/privacy',
    name: 'Privacy Policy',
    component: PrivacyPolicy,
    meta: { showHeader: false },
  },
]

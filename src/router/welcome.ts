import type { RouteRecordRaw } from 'vue-router'
import About from '@/views/Welcome/About.vue'
import Privacy from '@/views/Welcome/Privacy.vue'
import OpenSource from '@/views/Welcome/OpenSource.vue'
import Features from '@/views/Welcome/Features.vue'

export const welcomeRoutes: RouteRecordRaw[] = [
  {
    path: '/welcome/about',
    name: 'About',
    component: About,
  },
  {
    path: '/welcome/privacy',
    name: 'Privacy',
    component: Privacy,
  },
  {
    path: '/welcome/open-source',
    name: 'OpenSource',
    component: OpenSource,
  },
  {
    path: '/welcome/features',
    name: 'Features',
    component: Features,
  },
]

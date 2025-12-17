import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Settings from '../views/Settings/Settings.vue'
import { welcomeRoutes } from './welcome'
import { calculatorRoutes } from './calculators'
import { cryptographyRoutes } from './cryptography'
import { textRoutes } from './text'
import { imageToolsRoutes } from './imageTools'
import { otherRoutes } from './other'
import { developerToolsRoutes } from './developerTools'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { showHeader: false },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { showHeader: false },
  },
  ...welcomeRoutes,
  ...calculatorRoutes,
  ...cryptographyRoutes,
  ...textRoutes,
  ...imageToolsRoutes,
  ...otherRoutes,
  ...developerToolsRoutes,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

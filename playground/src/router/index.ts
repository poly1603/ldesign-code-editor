import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Home', icon: 'Home' }
  },
  {
    path: '/basic',
    name: 'basic',
    component: () => import('../views/BasicDemo.vue'),
    meta: { title: 'Basic Usage', icon: 'Code' }
  },
  {
    path: '/themes',
    name: 'themes',
    component: () => import('../views/ThemesDemo.vue'),
    meta: { title: 'Themes', icon: 'Palette' }
  },
  {
    path: '/languages',
    name: 'languages',
    component: () => import('../views/LanguagesDemo.vue'),
    meta: { title: 'Languages', icon: 'Languages' }
  },
  {
    path: '/diff',
    name: 'diff',
    component: () => import('../views/DiffDemo.vue'),
    meta: { title: 'Diff Editor', icon: 'GitCompare' }
  },
  {
    path: '/events',
    name: 'events',
    component: () => import('../views/EventsDemo.vue'),
    meta: { title: 'Events', icon: 'Zap' }
  },
  {
    path: '/readonly',
    name: 'readonly',
    component: () => import('../views/ReadonlyDemo.vue'),
    meta: { title: 'Read Only', icon: 'Lock' }
  },
  {
    path: '/composable',
    name: 'composable',
    component: () => import('../views/ComposableDemo.vue'),
    meta: { title: 'Composables', icon: 'Puzzle' }
  },
  {
    path: '/directive',
    name: 'directive',
    component: () => import('../views/DirectiveDemo.vue'),
    meta: { title: 'Directive', icon: 'Wand2' }
  }
]

export const navItems = routes.filter(r => r.meta?.title)

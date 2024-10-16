import { createRouter, createWebHistory } from 'vue-router'
const public_routes = [
  {
    path: '/',
    name: 'docx',
    component: () => import('@/views/docx.vue'),
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: () => import('@/views/404.vue'),
    meta: {
      keepAlive: true,
      title: '页面错误',
    },
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => {
    return {
      behavior: 'smooth',
      top: 0,
    }
  },
  routes: public_routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router

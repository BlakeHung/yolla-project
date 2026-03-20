import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/q2/data'
  },
  // Q2 - Data Management
  {
    path: '/q2/data',
    name: 'DataManagement',
    component: () => import('../views/Q2/DataManagement.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

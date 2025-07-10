import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Obat from '../views/Obat.vue'
import Persediaan from '../views/Persediaan.vue'
import Transaksi from '../views/Transaksi.vue'
import Laporan from '../views/Laporan.vue'

import { useUserStore } from '../stores/user'

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Dashboard },
  { path: '/obat', component: Obat },
  { path: '/persediaan', component: Persediaan },
  { path: '/transaksi', component: Transaksi },
  { path: '/laporan', component: Laporan },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.path !== '/login' && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router

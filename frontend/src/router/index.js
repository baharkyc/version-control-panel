import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import SignInPage from '../pages/SignInPage.vue'

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: HomePage,
    meta: { requiresAuth: true }
  },
  { 
    path: '/signin',
    name: 'SignIn',
    component: SignInPage 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))

  if (to.meta.requiresAuth && !user) { //user not signed in
    next('/signin') //direct to sign in page

  } else {
    next()
  }
})



export default router;

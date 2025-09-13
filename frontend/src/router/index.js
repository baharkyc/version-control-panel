import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import SignInPage from '../pages/SignInPage.vue'

//define routes
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

//create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user')) //retrieve stored user

  //if route requires authentication and user is not signed in, direct to sign in page
  if (to.meta.requiresAuth && !user) { 
    next('/signin') 

  } else {
    next()
  }
})



export default router;

import { createRouter, createWebHistory } from 'vue-router'
import homeView from '../views/homeView.vue'
import aboutView from '../views/aboutView.vue'
import loginView from '../views/loginView.vue'
import resourceView from '../views/resourceView.vue'
import supportView from '../views/supportView.vue'
import accessDenied from '../views/accessDeniedView.vue'
import accountView from '../views/accountView.vue'
import store from '../store';



//routes for page navigation 
//authication guards on pages only accessible after logging in
const routes = [
  {
    path: '/',
    name: 'Home',
    component: homeView
  },
  {
    path: '/about',
    name: 'About',
    component: aboutView,
    beforeEnter: (to, from, next) => {
      const loggedInUser = store.getters.getUser;
      if (!loggedInUser.uid) {
        next({ name: 'Denied' });
      } else {
        next();
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: loginView
  },
  {
    path: '/resources',
    name: 'Resource',
    component: resourceView,
    beforeEnter: (to, from, next) => {
      const loggedInUser = store.getters.getUser;
      if (!loggedInUser.uid) {
        next({ name: 'Denied' });
      } else {
        next();
      }
    }
  },
  {
    path: '/support',
    name: 'Support',
    component: supportView,
    beforeEnter: (to, from, next) => {
      const loggedInUser = store.getters.getUser;
      if (!loggedInUser.uid) {
        next({ name: 'Denied' });
      } else {
        next();
      }
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: accountView,
    beforeEnter: (to, from, next) => {
      const loggedInUser = store.getters.getUser;
      if (!loggedInUser.uid) {
        next({ name: 'Denied' });
      } else {
        next();
      }
    }
  },
  {
    path:'/denied',
    name: 'Denied',
    component: accessDenied
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
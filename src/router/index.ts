import Vue from 'vue'
import store from '../store';
import VueRouter, { RouteConfig } from 'vue-router'
import Home from "@/views/Home.vue";
import Unauthorized from "@/views/Unauthorized.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home',
    },
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: Unauthorized,
    meta: {
      title: 'Unauthorized',
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Register',
      guest: true
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login',
      guest: true
    },
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      title: 'About',
      requireAuth: true
    },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const athleteName = to.params.athletename;
  if (athleteName) {
    document.title = `${to.meta.title} | ${athleteName}`;
  } else {
    document.title = to.meta.title ? to.meta.title : "Apex Showcase 2020";
  }
  next();
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireAuth)) {
    if (store.getters.getToken) {
      next();
      return;
    }
    router.push({path: "login", query:{ redirect: `${to.name}`}});
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    if (store.getters.getToken) {
      next("/");
      return;
    }
    next();
  } else {
    next();
  }
});


export default router

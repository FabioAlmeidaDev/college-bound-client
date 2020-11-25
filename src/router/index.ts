import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Athletes from "@/views/Athletes.vue";
import AthleteDetails from "@/views/AthleteDetails.vue";
import Login from "@/views/Login.vue";
import Edit from "@/views/Edit.vue";
import Register from "@/views/Register.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/signup',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Register'
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login'
    },
  },
  {
    path: '/athletes',
    name: 'Athletes',
    component: Athletes,
    meta: {
      title: 'Athletes'
    },
  },
  {
    path: '/athletes/:athletename/:id',
    name: 'AthleteDetails',
    component: AthleteDetails,
    meta: {
      title: 'Athlete Details'
    },
  },
  {
    path: '/edit/:id',
    name: 'Edit',
    component: Edit,
    props: true,
    meta: {
      title: 'Edit'
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
      title: 'About'
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
  if(athleteName){
    document.title = `${to.meta.title} | ${athleteName}`;
  }else{
    document.title = to.meta.title ? to.meta.title : "Apex Showcase 2020";
  }
  next();
});

export default router

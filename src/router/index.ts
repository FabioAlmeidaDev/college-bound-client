import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Athletes from "@/views/Athletes.vue";
import AthleteDetails from "@/views/AthleteDetails.vue";
import List from "@/views/List.vue";
import Edit from "@/views/Edit.vue";
import Register from "@/views/Register.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Register',
    component: Register
  },
  {
    path: '/list',
    name: 'List',
    component: List
  },
  {
    path: '/athletes',
    name: 'Athletes',
    component: Athletes
  },
  {
    path: '/athletes/:id',
    name: 'AthleteDetails',
    component: AthleteDetails
  },
  {
    path: '/edit/:id',
    name: 'Edit',
    component: Edit,
    props: true
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

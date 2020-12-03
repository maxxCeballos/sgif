import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue';
import rutas from '../config/routes.config';
import { component } from 'vue/types/umd';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children:[
      {
        path: 'agregarDatosMesaExamen',
        name: 'transaccionADME',
        component:()=> import('../components/transacciones/agregarDatosMesa/MesasSolicitadas2.vue' )
      },
      {
        path: 'mesasCompartidas',
        name: 'transaccionADMEC',
        props: true,
        component:()=> import('../components/transacciones/agregarDatosMesa/MesasCompartidas2.vue' )
      },
      {
        path: 'crearIndividual',
        name: 'transaccionADMEI',
        props: true,
        component:()=> import('../components/transacciones/agregarDatosMesa/MesaIndividual.vue' )
      },
      {
        path: rutas.INSCRIBIR_MESA.ruta,
        name: rutas.INSCRIBIR_MESA.nombre,
        component: rutas.INSCRIBIR_MESA.component(),
      }

    ]
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
  routes
})

export default router

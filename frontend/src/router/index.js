import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue';
import rutas from '../config/routes.config';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  }, {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }, {
    path: rutas.INSCRIBIR_MESA.ruta,
    name: rutas.INSCRIBIR_MESA.nombre,
    component: rutas.INSCRIBIR_MESA.component
  }, {
    path: rutas.AGREGAR_DATOS_MESA.ruta,
    name: rutas.AGREGAR_DATOS_MESA.nombre,
    component: rutas.AGREGAR_DATOS_MESA.component
  }, {
    path: rutas.CERRAR_MESA.ruta,
    name: rutas.CERRAR_MESA.nombre,
    component: rutas.CERRAR_MESA.component
  }, {
    path: rutas.CONSULTAR_ALUMNO.ruta,
    name: rutas.CONSULTAR_ALUMNO.nombre,
    component: rutas.CONSULTAR_ALUMNO.component
  }
]

const router = new VueRouter({
  routes
})

export default router

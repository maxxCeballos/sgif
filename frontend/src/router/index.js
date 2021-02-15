import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue';
import rutas from '../config/routes.config';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  }, {
    path: rutas.INSCRIBIR_MESA.ruta,
    name: rutas.INSCRIBIR_MESA.nombre,
    component: () => import('../views/InscribirMesa.vue')
  }, {
    path: rutas.AGREGAR_DATOS_MESA.ruta,
    name: rutas.AGREGAR_DATOS_MESA.nombre,
    component: () => import('../views/AgregarDatosMesa.vue')
  }, {
    path: rutas.CERRAR_MESA.ruta,
    name: rutas.CERRAR_MESA.nombre,
    component: () => import('../views/CerrarMesa.vue')
  }, {
    path: rutas.CONSULTAR_ALUMNO.ruta,
    name: rutas.CONSULTAR_ALUMNO.nombre,
    component: () => import('../views/ConsultarAlumno.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router

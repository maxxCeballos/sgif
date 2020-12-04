<template>
  <v-card height="1045" max-width="344">
    <v-navigation-drawer
      class="deep-purple accent-4"
      dark
      permanent
      absolute
      left
      width="344"
    >
      <template v-slot:prepend>
        <!-- TITULO -->
        <h1 class="mt-8 yellow--text lighten-5" color="white">SGIF</h1>
        <h4 class="mb-8 yellow--text lighten-5">
          Sistema Gestor Instituto Fatima
        </h4>
        <!-- USUARIO -->
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="../assets/avatar.png.jpg" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Michael Jhonson</v-list-item-title>
            <v-list-item-subtitle>Secretario</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-divider />
      <!-- SECCIONES -->
      <v-list shaped>
        <v-list-group
          v-for="item in secciones"
          :key="item.nombre"
          v-model="item.active"
          :prepend-icon="item.icon"
          no-action
          active-class="white"
          color="deep-purple accent-4"
        >
          <!-- CATEGORIA -->
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.nombre"></v-list-item-title>
            </v-list-item-content>
          </template>
          <!-- TRANSACCIONES -->
          <v-list-item
            v-for="child in item.transacciones"
            :key="child.nombre"
            :to="child.ruta"
            link
          >
            <v-list-item-content>
              <v-list-item-title>{{ child.nombre }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
      <!-- BTN CERRAR SESION -->
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block> Cerrar Sesión </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import rutas from "../config/routes.config";

export default {
  name: "Sidebar",
  data: function () {
    return {
      secciones: [
        {
          nombre: "Alumnos",
          icon: "mdi-school-outline",
          active: true,
          transacciones: [
            {
              nombre: rutas.CONSULTAR_ALUMNO.nombre,
              ruta: rutas.CONSULTAR_ALUMNO.ruta,
            },
          ],
        },
        {
          nombre: "Curso",
          icon: "mdi-newspaper-variant-outline",
          active: true,
          transacciones: [{ nombre: "Consultar Curso" }],
        },
        {
          nombre: "Mesa de Examen",
          icon: "mdi-google-classroom",
          active: true,
          transacciones: [
            {
              nombre: rutas.INSCRIBIR_MESA.nombre,
              ruta: rutas.INSCRIBIR_MESA.ruta,
            },
            {
              nombre: rutas.AGREGAR_DATOS_MESA.nombre,
              // ruta: rutas.AGREGAR_DATOS_MESA.ruta,
              ruta: rutas.AGREGAR_DATOS_MESA.ruta,
            },
            {
              nombre: rutas.CERRAR_MESA.nombre,
              ruta: rutas.CERRAR_MESA.ruta,
            },
          ],
        },
      ],
    };
  },
};
</script>

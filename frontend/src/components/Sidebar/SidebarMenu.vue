<template>
  <v-list shaped>
    <v-list-group
      v-for="item in secciones"
      :key="item.nombre"
      v-model="item.active"
      :prepend-icon="item.icon"
      no-action
      active-class="indigo lighten-5"
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
        active-class="grey darken-4"
        color="indigo lighten-5"
        link
      >
        <v-list-item-content>
          <v-list-item-title>{{ child.nombre }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>

<script>
import rutas from "@/config/routes.config";

export default {
  data: function () {
    return {
      secciones: [
        {
          nombre: "Alumnos",
          icon: "mdi-school-outline",
          active: false,
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
          active: false,
          transacciones: [{ nombre: "Consultar Curso" }],
        },
        {
          nombre: "Mesa de Examen",
          icon: "mdi-google-classroom",
          active: false,
          transacciones: [
            {
              nombre: rutas.INSCRIBIR_MESA.nombre,
              ruta: rutas.INSCRIBIR_MESA.ruta,
            },
            {
              nombre: rutas.AGREGAR_DATOS_MESA.nombre,
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
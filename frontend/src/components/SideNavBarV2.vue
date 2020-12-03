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
        <h1 class="mt-8 yellow--text lighten-5" color="white">SGIF</h1>
        <h4 class="mb-8 yellow--text lighten-5">
          Sisttema Gestor Instituto Fatima
        </h4>
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
      <v-divider></v-divider>

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
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.nombre"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="child in item.transacciones"
            :key="child.nombre"
            link
          >
            <v-list-item-content>
              <v-list-item-title>{{ child.nombre }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block> Cerrar Sesión </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import rutas from '../config/routes.config';

export default {
  name: "Sidebar",
  data: function () {
    return {
      secciones: [
        {
          nombre: "Alumnos",
          icon: "mdi-school-outline",
          active: true,
          transacciones: [rutas.INSCRIBIR_MESA],
        },
        {
          nombre: "Curso",
          icon: "mdi-google-classroom",
          active: true,
          transacciones: [
            { nombre: "Inscribir Alumno Mesa de Examen" },
            { nombre: "Agregar Datos Mesa de Examen" },
            { nombre: "Cerrar Mesa de Examen" },
          ],
        },
        {
          nombre: "Mesa de Examen",
          icon: "mdi-newspaper-variant-outline",
          active: true,
          transacciones: [{ nombre: "Consultar Curso" }],
        },
      ],
      alumnos: [
        "Consultar Informacion",
        "Inscribir Alumno",
        "Modificar Datos Alumno",
        "Reinscribir Alumno",
      ],
      curso: ["Consultar Imformación", "Crear Curso"],
      mesa: [
        "Inscribir Alumno en Mesa de Examen",
        "Agregar Datos Mesa de Examen",
        "Cerrar Mesas de Examen",
      ],
    };
  },
};
</script>

<style scoped>
.border {
  color: white;
  text: deep-purple--text text--accent-4;
}
</style>

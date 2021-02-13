<template>
  <v-navigation-drawer disable-resize-watcher permanent app>
    <!-- <v-navigation-drawer> -->
    <template v-slot:prepend>
      <!-- TITULO -->
      <v-container class="contTit" @click="handleTitulo">
        <h1 class="text-center">SGIF</h1>
        <h4 class="text-center">Sistema Gestor Instituto Fatima</h4>
      </v-container>
      <!-- USUARIO -->
      <v-divider />
      <v-container>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img alt="avatar" src="@/assets/avatar.png.jpg" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Michael Johnson</v-list-item-title>
            <v-list-item-subtitle>Secretario</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-container>
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
    <!-- BTN CERRAR SESION -->
    <template v-slot:append>
      <div class="pa-2">
        <v-btn block> Cerrar Sesión </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import rutas from "@/config/routes.config";

export default {
  name: "Sidebar",
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
  methods: {
    handleTitulo() {
      this.$router.push({ path: "/" });
    },
  },
};
</script>

<style scoped>
.fondoClaro {
  background: #e2e2e2;
}

.contTit {
  cursor: pointer;
}

.colorClaro {
  color: #1c0f13;
}
</style>
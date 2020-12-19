<template>
  <v-container v-if="show">
    <v-card v-if="this.alumno && Object.entries(this.alumno).length !== 0" elevation="2" outlined>
      <v-card-title class="justify-center">
        {{ alumno.nombre + " " + alumno.apellido }} - {{ alumno.legajo }}
      </v-card-title>
      <v-tabs v-model="tab">
        <v-tab v-for="item in tabs" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <!-- INFO BÁSICA -->
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <carta-info-basica :alumno="alumno" />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <!-- ASISTENCIA -->
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <carta-asistencia />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <!-- CALIFICACION -->
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <carta-calificacion />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <!-- MESA DE EXAMEN -->
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <carta-mesa-examen />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <!-- FAMILIA -->
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <carta-familia />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <v-card v-else elevation="2" outlined>
      <v-card-title>No hay Alumno para mostrar</v-card-title>
    </v-card>
  </v-container>
</template>

<script>
import CartaAsistencia from "./CartaAsistencia.vue";
import CartaCalificacion from "./CartaCalificacion.vue";
import CartaFamilia from "./CartaFamilia.vue";
import CartaInfoBasica from "./CartaInfoBasica.vue";
import CartaMesaExamen from "./CartaMesaExamen.vue";

export default {
  name: "TablaInfo",
  components: {
    CartaInfoBasica,
    CartaAsistencia,
    CartaCalificacion,
    CartaMesaExamen,
    CartaFamilia,
  },
  props: ["show", "alumno"],
  data() {
    return {
      tab: null,
      hayAlumno: false,
      tabs: [
        "Informacion Básica",
        "Asistencias",
        "Calificaciones",
        "Mesas de Examen",
        "Familia",
      ],
    };
  },
};
</script>
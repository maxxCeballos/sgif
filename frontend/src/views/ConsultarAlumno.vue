<template>
  <div>
    <buscador-legajos v-on:set-legajo="buscarAlumno" />
    <tabla-info :show="mostrarInfo" :alumno="alumno" />
  </div>
</template>

<script>
import BuscadorLegajos from "../components/BuscadorLegajos.vue";
import TablaInfo from "../components/transacciones/consultarAlumno/TablaInfo.vue";

export default {
  name: "ConsultarAlumno",
  data() {
    return {
      legajo: "",
      alumno: {},
      mostrarInfo: false,
    };
  },
  components: {
    BuscadorLegajos,
    TablaInfo,
  },
  methods: {
    buscarAlumno(legajoParam) {
      this.legajo = legajoParam;

      if (this.legajo === "nadie") {
        this.alumno = {};
      } else {
        this.alumno = {
          nombre: "Guido",
          apellido: "Canevello",
          legajo: this.legajo,
          dni: 39682936,
        };
      }

      this.mostrarInfo = true;
    },
  },
};
</script>
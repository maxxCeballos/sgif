<template>
  <div>
    <!-- Buscador de Legajos -->
    <buscador-legajos v-on:set-legajo="obtenerDictados" />

    <TablaInscripcion
      v-bind:show="mostrarTabla"
      v-bind:materias="materias"
      v-bind:isLoading="tablaLoading"
      v-on:select-materia="selectMateria"
    />

    <CartelExito
      :titulo="'SALIO TODO GENIAL'"
      :mensaje="`Te inscribiste a la mesa de la materia ${materiaSeleccionada.nombre}`"
      :estaActivado="confirmacion"
      v-on:cerrar-cartel="confirmarOperacion"
    />

    <cartel-error
      :mensaje="`Legajo Incorrecto`"
      v-bind:estaActivado="error"
      v-on:cerrar-cartel="errorOperacion"
    />
  </div>
</template>

<script>
// import axios from "axios";
import TablaInscripcion from "@/components/transacciones/inscribirMesa/TablaInscripcion";
import CartelExito from "../components/CartelExito.vue";
import CartelError from "../components/CartelError.vue";
import BuscadorLegajos from "../components/BuscadorLegajos.vue";

export default {
  name: "InscribirMesa",
  data() {
    return {
      confirmacion: false,
      error: false,
      legajo: "",
      mostrarTabla: false,
      apagarT: false,
      materias: [],
      materiaSeleccionada: {},
      tablaLoading: true,
    };
  },
  components: {
    TablaInscripcion,
    CartelExito,
    CartelError,
    BuscadorLegajos,
  },

  methods: {
    obtenerDictados(legajoParam) {
      this.mostrarTabla = true;
      this.tablaLoading = true;
      this.error = false;
      this.materias = [];
      this.legajo = legajoParam;

      // TODO: el mostrarTabla tiene q ir en then
      // axios
      //   .get("https://localhost:5000/inscribir-mesa/obtener-dictados/:legajo")
      //   .then((res) => (this.todos = res.data))
      //   .catch((err) => console.log(err));

      setTimeout(() => {
        this.materias = [
          {
            id: 1,
            nombre: "Matematicas",
            anio: 1,
            cicloLectivo: 2018,
          },
          {
            id: 2,
            nombre: "Lengua",
            anio: 3,
            cicloLectivo: 2020,
          },
          {
            id: 3,
            nombre: "Biologia",
            anio: 2,
            cicloLectivo: 2019,
          },
        ];

        this.error = this.legajo === "error";
        this.mostrarTabla = this.legajo !== "error";
        this.tablaLoading = false;
        if (this.legajo === "vacio") {
          this.materias = [];
        }
      }, 2000);
    },

    selectMateria(idMateria) {
      this.materiaSeleccionada = this.materias.find(
        (materia) => materia.id === idMateria
      );
      this.confirmacion = true;
    },

    confirmarOperacion() {
      this.confirmacion = false;
    },

    errorOperacion() {
      this.error = false;
    },
  },
};
</script>
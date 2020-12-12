<template>
  <div>
    <!-- Buscador de Legajos -->
    <buscador-legajos v-on:set-legajo="obtenerDictados" />

    <cartel-exito ref="cartelExito" v-on:confirmar-operacion="confirmarExito" />

    <cartel-error ref="cartelError" v-on:confirmar-operacion="errorOperacion" />

    <TablaInscripcion
      v-bind:show="mostrarTabla"
      v-bind:materias="materias"
      v-bind:isLoading="tablaLoading"
      v-on:select-materia="selectMateria"
    />

    <cartel-confirmacion
      ref="cartelConfirmacion"
      v-on:confirmar-operacion="confirmarOperacion"
    />
  </div>
</template>

<script>
// import axios from "axios";
import TablaInscripcion from "@/components/transacciones/inscribirMesa/TablaInscripcion";
import CartelExito from "../components/CartelExito.vue";
import CartelError from "../components/CartelError.vue";
import BuscadorLegajos from "../components/BuscadorLegajos.vue";
import CartelConfirmacion from "../components/CartelConfirmacion.vue";

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
      tablaLoading: true,
      materiaSeleccionada: {},
    };
  },
  components: {
    TablaInscripcion,
    CartelExito,
    CartelError,
    BuscadorLegajos,
    CartelConfirmacion,
  },

  methods: {
    obtenerDictados(legajoParam) {
      if (this.error) {
        this.error = false;
        this.$refs.cartelError.cerrarCartel();
      }
      this.mostrarTabla = true;
      this.tablaLoading = true;
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
        if (this.error) {
          this.$refs.cartelError.abrirCartel("Legajo Incorrecto");
        }
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
      this.$refs.cartelConfirmacion.abrirCartel(
        `Inscribirse a ${this.materiaSeleccionada.nombre}`
      );
    },

    confirmarOperacion() {
      this.confirmacion = true;
      this.$refs.cartelExito.abrirCartel(
        `Se inscribió a la mesa de la materia: ${this.materiaSeleccionada.nombre}`
      );
    },

    confirmarExito() {
      this.confirmacion = false;
      // this.$router.push({ path: "/" });
    },

    errorOperacion() {
      this.error = false;
    },
  },
};
</script>
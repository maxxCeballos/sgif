<template>
  <div>
    <!-- Buscador de Legajos -->
    <buscador-legajos v-on:set-legajo="obtenerDictados" />

    <cartel-confirmacion
      ref="cartelConfirmacion"
      v-on:confirmar-operacion="confirmarOperacion"
    />

    <loading>

    <cartel-exito ref="cartelExito" v-on:confirmar-operacion="confirmarExito" />

    <cartel-error ref="cartelError" />

    <TablaInscripcion
      v-bind:show="mostrarTabla"
      v-bind:materias="materias"
      v-bind:isLoading="tablaLoading"
      v-on:select-materia="selectMateria"
    />
  </div>
</template>

<script>
import axios from "axios";
import TablaInscripcion from "@/components/transacciones/inscribirMesa/TablaInscripcion";
import CartelExito from "../components/CartelExito.vue";
import CartelError from "../components/CartelError.vue";
import BuscadorLegajos from "../components/BuscadorLegajos.vue";
import CartelConfirmacion from "../components/CartelConfirmacion.vue";
import moduleName from '../components/'

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
    async obtenerDictados(legajoParam) {
      this.$refs.cartelError.cerrarCartel();
      this.mostrarTabla = true;
      this.tablaLoading = true;
      this.materias = [];
      this.legajo = legajoParam;

      // TODO: el mostrarTabla tiene q ir en then
      await axios
        .get(
          `http://localhost:5000/inscribir-mesa/obtener-dictados/${this.legajo}`
        )
        .then((res) => {
          console.log(res.data);
          this.materias = res.data.response.dictados;
        })
        .catch((err) => {
          console.log(err.response)
          if (err.response.data.expanded) {
            this.$refs.cartelError.abrirCartel(err.response.data.expanded);
            this.mostrarTabla = false;
          }
        });

      this.tablaLoading = false;

      // setTimeout(() => {
      //   this.materias = [
      //     {
      //       id: 1,
      //       nombre: "Matematicas",
      //       anio: 1,
      //       cicloLectivo: 2018,
      //     },
      //     {
      //       id: 2,
      //       nombre: "Lengua",
      //       anio: 3,
      //       cicloLectivo: 2020,
      //     },
      //     {
      //       id: 3,
      //       nombre: "Biologia",
      //       anio: 2,
      //       cicloLectivo: 2019,
      //     },
      //   ];
      //   this.error = this.legajo === "error";
      //   if (this.error) {
      //     this.$refs.cartelError.abrirCartel("Legajo Incorrecto");
      //   }
      //   this.mostrarTabla = this.legajo !== "error";
      //   this.tablaLoading = false;
      //   if (this.legajo === "vacio") {
      //     this.materias = [];
      //   }
      // }, 2000);
    },

    selectMateria(idMateria) {
      this.materiaSeleccionada = this.materias.find(
        (materia) => materia.id === idMateria
      );
      this.$refs.cartelConfirmacion.abrirCartel(
        `Inscribirse a ${this.materiaSeleccionada.nombreMateria}`
      );
    },

    confirmarOperacion() {
      this.confirmacion = true;
      setTimeout(() => {
        
      }, 2000);
      this.$refs.cartelExito.abrirCartel(
        `Se inscribió a la mesa de la materia: ${this.materiaSeleccionada.nombreMateria}`
      );
    },

    confirmarExito() {
      this.confirmacion = false;
      // this.$router.push({ path: "/" });
    },
  },
};
</script>
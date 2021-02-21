<template>
  <div>
    <buscador-legajos v-on:set-legajo="obtenerDictados" />

    <cartel-confirmacion
      ref="cartelConfirmacion"
      v-on:confirmar-operacion="confirmarOperacion"
    />

    <loading ref="cartelLoading" />

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
import Loading from "../components/Loading.vue";
import { ipBackend } from "../config/backend.config";

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
      idAlumno: "",
      msgNoMaterias: "No hay materias para rendir",
    };
  },
  components: {
    TablaInscripcion,
    CartelExito,
    CartelError,
    BuscadorLegajos,
    CartelConfirmacion,
    Loading,
  },

  methods: {
    async obtenerDictados(legajoParam) {
      this.$refs.cartelError.cerrarCartel();
      this.$refs.cartelExito.cerrarCartel();
      this.mostrarTabla = true;
      this.tablaLoading = true;
      this.materias = [];
      this.legajo = legajoParam;

      await axios
        .get(`${ipBackend}/inscribir-mesa/obtener-dictados/${this.legajo}`)
        .then((res) => {
          if (res.status == 204) {
            this.$refs.cartelError.abrirCartel(this.msgNoMaterias);
            this.mostrarTabla = false;
          } else if (res.status == 200 && !res.data.response.idAlumno) {
            // Mesa de Castigo
            this.$refs.cartelError.abrirCartel(res.data.response.message);
            this.mostrarTabla = false;
          } else {
            // Consulta responde correctamente
            this.materias = res.data.response.dictados;
            this.idAlumno = res.data.response.idAlumno;
          }
        })
        .catch((err) => {
          if (err.response.status == 404) {
            this.$refs.cartelError.abrirCartel(err.response.data.message);
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

    async confirmarOperacion() {
      this.confirmacion = true;
      this.$refs.cartelLoading.activar();

      let valoresDictado = {
        id: this.materiaSeleccionada.id,
        nombreMateria: this.materiaSeleccionada.nombreMateria,
        anioMateria: this.materiaSeleccionada.anioMateria,
        cicloLectivo: this.materiaSeleccionada.cicloLectivo,
      };

      await axios
        .post(
          `${ipBackend}/inscribir-mesa/registrar-mesa/${this.idAlumno}`,
          valoresDictado
        )
        .then((res) => {
          if (res.status == 200) {
            this.$refs.cartelLoading.desactivar();
            let msg =
              res.data.response.mensaje +
              `. Se inscribió a la mesa de la materia: ${this.materiaSeleccionada.nombreMateria}. `;
            if (res.data.response.fechaHora && res.data.response.aula) {
              let fechaHora = new Date(res.data.response.fechaHora);

              let diaExamen = `${fechaHora.getDate()}/${fechaHora.getMonth() + 1}/${fechaHora.getFullYear()}`;
              let horaExamen = `${fechaHora.getHours()}:${fechaHora.getMinutes()}`;
              msg +=
                `El exámen será en el aula: ${res.data.response.aula}, ` +
                `el dia: ${diaExamen} a las ${horaExamen}`;
            }
            this.$refs.cartelExito.abrirCartel(msg);
          }
        })
        .catch((err) => {
          if (
            err.response &&
            (err.response.status == 400 || err.response.status == 500)
          ) {
            this.$refs.cartelError.abrirCartel(err.response.data.message);
            this.mostrarTabla = false;
          } else {  
            console.log(err)
            this.$refs.cartelError.abrirCartel("Error al procesar la respuesta del servidor");
            this.mostrarTabla = false;
          }
        });

      // setTimeout(() => {
      //   this.$refs.cartelLoading.desactivar();
      //   this.$refs.cartelExito.abrirCartel(
      //   `Se inscribió a la mesa de la materia: ${this.materiaSeleccionada.nombreMateria}`
      // );
      // }, 2000);
    },

    confirmarExito() {
      this.confirmacion = false;
    },
  },
};
</script>
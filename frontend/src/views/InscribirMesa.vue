<template>
  <div>
    <!-- Buscador de Legajos -->
    <v-container>
      <v-card elevation="2" outlined>
        <v-card-title>Ingrese un Legajo</v-card-title>
        <v-card-text>
          <v-form @submit="buscarLegajo">
            <v-row>
              <v-col>
                <v-text-field v-model="legajo" label="Ingrese un Legajo" />
              </v-col>
              <v-col>
                <v-btn @click="buscarLegajo" elevation="1" large
                  >Buscar Materias
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>

    <TablaInscripcion
      v-bind:show="mostrarTabla"
      v-bind:materias="materias"
      v-on:select-materia="selectMateria"
    />

    <CartelExito
      :titulo="'SALIO TODO GENIAL'"
      :mensaje="`Te inscribiste a la mesa de la materia ${materiaSeleccionada.nombre}`"
      :estaActivado="confirmacion"
      v-on:cerrar-cartel="confirmarOperacion"
    />
  </div>
</template>

<script>
// import axios from "axios";
import TablaInscripcion from "@/components/transacciones/inscribirMesa/TablaInscripcion";
import CartelExito from "../components/CartelExito.vue";

export default {
  name: "InscribirMesa",
  data() {
    return {
      confirmacion: false,
      legajo: "",
      mostrarTabla: false,
      apagarT: false,
      materias: [],
      materiaSeleccionada: {},
    };
  },
  components: {
    TablaInscripcion,
    CartelExito,
  },

  methods: {
    buscarLegajo(e) {
      e.preventDefault();

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
      // TODO: el mostrarTabla tiene q ir en then
      // axios
      //   .get("https://localhost:5000/inscribir-mesa/obtener-dictados/:legajo")
      //   .then((res) => (this.todos = res.data))
      //   .catch((err) => console.log(err));

      this.mostrarTabla = true;
    },

    selectMateria(idMateria) {
      this.materiaSeleccionada = this.materias.find(
        (materia) => materia.id === idMateria
      );
      this.confirmacion = true;
    },

    confirmarOperacion() {
      console.log("Confirma2");
    },
  },
};
</script>

<style scoped>
</style>
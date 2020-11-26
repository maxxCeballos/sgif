<template>
  <div class="inscribir-mesa">
    <!-- Buscador de Legajos -->
    <form @submit="buscarLegajo">
      <input
        type="text"
        v-model="legajo"
        name="legajo"
        placeholder="Ingrese el Legajo"
      />

      <button>Buscar Materias</button>
    </form>

    <TablaInscripcion
      v-bind:show="mostrarTabla"
      v-bind:materias="materias"
      v-bind:apagar="apagarT"
      v-on:select-materia="selectMateria"
      v-on:select-apagar="apagarTabla"
    />

    <ComponenteTest
      v-bind:apagar="apagarT"
      v-bind:show="mostrarTabla"
      v-on:select-apagar="apagarTabla"
    />
  </div>
</template>

<script>
// import axios from "axios";
import TablaInscripcion from "@/components/inscribir-mesa/TablaInscripcion";
import ComponenteTest from "@/components/inscribir-mesa/ComponenteTest";

export default {
  name: "InscribirMesa",
  data() {
    return {
      legajo: "",
      mostrarTabla: false,
      apagarT: false,
      materias: [],
    };
  },
  components: {
    TablaInscripcion,
    ComponenteTest,
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
      let materiaSeleccionada = this.materias.find(
        (materia) => materia.id === idMateria
      );
      console.log(materiaSeleccionada.nombre);
    },

    apagarTabla() {
      this.apagarT = !this.apagarT;
    },
  },
};
</script>

<style scoped>
</style>
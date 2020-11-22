<template>
  <div>
    <div>
      <md-table>
        <md-table-row>
          <md-table-head>Nombre</md-table-head>
          <md-table-head md-numeric>Año</md-table-head>
          <md-table-head>Ciclo Lectivo</md-table-head>
        </md-table-row>

        <!-- <div v-bind:key="materia.id" v-for="materia in materias"> -->
          <md-table-row v-bind:key="materia.id" v-for="materia in materias">
            <md-table-cell> {{materia.nombre}} </md-table-cell>
            <md-table-cell md-numeric> {{materia.anio}} </md-table-cell>
            <md-table-cell> {{materia.cicloLectivo}} </md-table-cell>
          </md-table-row>
        <!-- </div> -->
      </md-table>
    </div>

    <div v-bind:key="materia.id" v-for="materia in materias">
      {{ materia.nombre }}
    </div>
  </div>
</template>

<script>
export default {
  name: "InscribirMesa",
  component: {},
  data() {
    return {
      materias: [
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
      ],
    };
  },
};
</script>

<style scoped>
</style>
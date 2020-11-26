<template>
  <div>
    <div v-if="show">
      <md-table>
        <md-table-row>
          <md-table-head>Nombre</md-table-head>
          <md-table-head md-numeric>Año</md-table-head>
          <md-table-head>Ciclo Lectivo</md-table-head>
        </md-table-row>

        <!-- <div v-bind:key="materia.id" v-for="materia in materias"> -->

        <md-table-row
          v-bind:key="materia.id"
          v-for="materia in materias"
          @click="$emit('select-materia', materia.id)"
        >
          <md-table-cell> {{ materia.nombre }} </md-table-cell>
          <md-table-cell md-numeric> {{ materia.anio }} </md-table-cell>
          <md-table-cell> {{ materia.cicloLectivo }} </md-table-cell>
        </md-table-row>

        <!-- </div> -->
      </md-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "TablaInscripcion",
  props: ["show", "materias"],
};
</script>

<style scoped>
</style>
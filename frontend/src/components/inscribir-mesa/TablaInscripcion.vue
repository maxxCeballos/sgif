<template>
  <div v-if="show">
    <v-container>
      <v-card elevation="2" outlined>
        <v-card-title>Materias Para Rendir</v-card-title>
        <v-card-subtitle>Seleccione Una</v-card-subtitle>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="materias"
            :items-per-page="5"
            class="elevation-1"
            @click:row="handleClickRow"
          />
        </v-card-text>
      </v-card>
    </v-container>
  </div>
  <!-- <md-table>
        <md-table-row>
          <md-table-head>Nombre</md-table-head>
          <md-table-head md-numeric>Año</md-table-head>
          <md-table-head>Ciclo Lectivo</md-table-head>
        </md-table-row> -->

  <!-- <md-table-row
          v-bind:key="materia.id"
          v-for="materia in materias"
          @click="$emit('select-materia', materia.id)"
        >
          <md-table-cell> {{ materia.nombre }} </md-table-cell>
          <md-table-cell md-numeric> {{ materia.anio }} </md-table-cell>
          <md-table-cell> {{ materia.cicloLectivo }} </md-table-cell>
        </md-table-row>
      </md-table> -->
</template>

<script>
export default {
  name: "TablaInscripcion",
  props: ["show", "materias"],
  data() {
    return {
      headers: [
        {
          text: "Nombre",
          align: "start",
          sortable: false,
          value: "nombre",
        },
        { text: "Año", value: "anio" },
        { text: "Ciclo Lectivo", value: "cicloLectivo" },
      ],
    };
  },
  methods: {
    handleClickRow(item) {
      this.$emit("select-materia", item.id);
    },
  },
};
</script>

<style scoped>
</style>
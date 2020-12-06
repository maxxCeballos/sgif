<template>
  <v-container v-if="show">
    <v-card v-if="isEmpty" elevation="2" outlined>
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

    <v-card v-else elevation="2" outlined>
      <v-card-title>Usted no posee Materias para rendir</v-card-title>
    </v-card>
  </v-container>
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
          value: "nombre",
        },
        { text: "Año", value: "anio" },
        { text: "Ciclo Lectivo", value: "cicloLectivo" },
      ],
      isEmpty: false,
    };
  },
  methods: {
    handleClickRow(item) {
      this.$emit("select-materia", item.id);
    },
  },
  beforeUpdate: function () {
    this.isEmpty = this.materias.length > 0;
  },
};
</script>

<style scoped>
</style>
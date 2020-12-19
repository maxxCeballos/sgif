<template>
  <v-container v-if="show">
    <v-card v-if="!isEmpty || (isEmpty && isLoading)" elevation="2" outlined>
      <v-card-title>Materias Para Rendir</v-card-title>
      <v-card-subtitle>Seleccione Una</v-card-subtitle>
      <v-card-text>
        {{this.testText}}
        <v-data-table
          :headers="headers"
          :items="materias"
          @click:row="handleClickRow"
          :loading="isLoading"
        />
      </v-card-text>
    </v-card>

    <v-card v-else-if="!isLoading" elevation="2" outlined>
      <v-card-title>Usted no posee Materias para rendir</v-card-title>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "TablaInscripcion",
  props: ["show", "materias", "isLoading"],
  data() {
    return {
      testText: "",
      headers: [
        {
          text: "Nombre",
          align: "start",
          value: "nombreMateria",
        },
        { text: "Año", value: "anioMateria" },
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
    this.isEmpty = this.materias.length === 0;
  },
};
</script>

<style scoped>
.v-card {
  background: #fefffe;
}

.v-data-table {
  background: #fefffe;
}
</style>
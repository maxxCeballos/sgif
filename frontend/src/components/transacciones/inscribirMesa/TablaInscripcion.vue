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
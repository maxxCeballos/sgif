<template>
  <v-container>
    <v-card v-if="mesas.length !== 0" elevation="2" outlined>
      <v-card-title>Mesas Evaluadas</v-card-title>
      <v-card-subtitle>Seleccione Una</v-card-subtitle>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="mesas"
          @click:row="handleClickRow"
        />
      </v-card-text>
    </v-card>

    <v-card v-else elevation="2" outlined>
      <v-card-title>No hay Mesas de Examen para Cerrar</v-card-title>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "TablaMesasCerrar",
  props: ["mesas"],
  data() {
    return {
      headers: [
        {
          text: "Acta",
          align: "start",
          value: "acta",
        },
        { text: "Fecha", value: "fecha" },
        { text: "Hora", value: "hora" },
        { text: "Materia", value: "nombreMateria" },
        { text: "Año", value: "anioMateria" },
        { text: "Ciclo Lectivo", value: "cicloLectivoMateria" },
        { text: "Aula", value: "aula" },
      ],
    };
  },
  methods: {
    handleClickRow(item) {
      this.$emit("select-mesa", item.acta);
    },
  },
};
</script>
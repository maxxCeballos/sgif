<template>
  <v-container v-if="show">
    <v-card v-if="mesa.alumnos.length !== 0" elevation="2" outlined>
      <v-card-title>Alumnos Inscriptos</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="mesa.alumnos">
          <template v-slot:[`item.condicion`]="props">
            <v-checkbox label="Ausente" v-model="props.item.esAusente" />
          </template>
          <!-- TODO: agregar funcionalidad para asignar correctamente los valores -->
          <template v-slot:[`item.nota`]="props">
            <v-text-field
              v-model="props.item.nota"
              name="quantity"
              outlined
              @input="getdata"
              type="number"
              v-bind:disabled="props.item.esAusente"
            ></v-text-field>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-card v-else elevation="2" outlined>
      <v-card-title>No hay Alumnos Inscriptos</v-card-title>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "TablaCargaNotas",
  props: ["show", "mesa"],
  data() {
    return {
      headers: [
        {
          text: "Legajo",
          align: "start",
          value: "legajo",
        },
        { text: "Nombre", value: "nombre" },
        { text: "Apellido", value: "apellido" },
        { text: "Condición", value: "condicion" },
        { text: "Nota", value: "nota" },
      ],
    };
  },
};
</script>
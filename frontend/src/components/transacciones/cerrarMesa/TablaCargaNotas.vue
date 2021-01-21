<template>
  <v-container v-if="show">
    <v-card v-if="mesa.alumnos.length !== 0" elevation="2" outlined>
      <v-card-title>
        <v-container pa-0>
          Alumnos Inscriptos
          <v-btn @click="handleSubmit" class="float-right" color="success">
            Registrar Notas
          </v-btn>
        </v-container>
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="mesa.alumnos">
          <template v-slot:[`item.condicion`]="props">
            <v-checkbox label="Ausente" v-model="props.item.esAusente" />
          </template>
          <template v-slot:[`item.nota`]="props">
            <v-text-field
              v-model="props.item.nota"
              name="quantity"
              type="text"
              v-bind:disabled="props.item.esAusente"
            />
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
      mensajeErrorNumero: "Revise los valores, debe ser numéricos",
      mensajeErrorComa: "Revise los valores, debe usar punto (.) no coma (,)",
      headers: [
        {
          text: "Legajo",
          align: "start",
          value: "legajo",
          sortable: false,
        },
        { text: "Nombre", value: "nombre", sortable: false },
        { text: "Apellido", value: "apellido", sortable: false },
        { text: "Condición", value: "condicion", sortable: false },
        { text: "Nota", value: "nota", sortable: false },
      ],
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      if (!this.mesa.alumnos.find((alumno) => isNaN(alumno.nota))) {
        console.log(this.mesa.alumnos[0].nota)
        if (!this.mesa.alumnos.find((alumno) => alumno.nota.includes(","))) {
          this.$emit("confirmar-operacion");
        } else {
          this.$emit("error-operacion", this.mensajeErrorComa);
        }
      } else {
        this.$emit("error-operacion", this.mensajeErrorNumero);
      }
    },
  },
};
</script>
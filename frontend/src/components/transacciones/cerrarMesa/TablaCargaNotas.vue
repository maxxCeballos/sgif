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
      mensajeErrorNumero:
        "Revise los valores, deben ser numéricos y con punto (.) en caso de decimales",
      mensajeErrorNota:
        "Revise los valores, no puede haber notas superiores a 10 o menores a 1",
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
      let esError = false;
      for (const alumno of this.mesa.alumnos) {
        if (!isNaN(alumno.nota)) {
          if (alumno.esAusente) {
            alumno.condicion = "Ausente";
          } else if (alumno.nota < 0 || alumno.nota > 10) {
            esError = true;
            this.$emit("error-operacion", this.mensajeErrorNota);
            break;
          }
        } else {
          esError = true;
          this.$emit("error-operacion", this.mensajeErrorNumero);
          break;
        }
      }
      if (!esError) {
        this.$emit("confirmar-operacion");
      }
    },
  },
};
</script>
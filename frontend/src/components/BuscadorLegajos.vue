<template>
  <v-container>
    <v-card elevation="2" outlined>
      <v-card-title>Ingrese un Legajo</v-card-title>
      <v-card-text>
        <v-form @submit="setLegajo">
          <v-row>
            <v-col>
              <v-text-field
                label="Legajo"
                outlined
                v-model="legajo"
              />
            </v-col>
            <v-col>
              <v-btn @click="setLegajo" elevation="1" large
                >Buscar Materias
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "BuscadorLegajos",
  data() {
    return {
      legajo: "",
    };
  },

  methods: {
    setLegajo(e) {
      e.preventDefault();
      this.$emit("set-legajo", this.legajo);
    },
  },
};
</script>
<template>
  <v-dialog v-model="estaActivado" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ titulo }}
      </v-card-title>

      <v-card-text>
        {{ mensaje }}
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="confirmarOperacion">
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// TODO: Cambiar por alerta

export default {
  name: "CartelExito",
  props: ["titulo", "mensaje", "estaActivado"],
  methods: {
    confirmarOperacion() {
        this.estaActivado = false;
        this.$emit("cerrar-cartel")
    },
  },
};
</script>
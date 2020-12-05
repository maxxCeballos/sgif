<template>
  <v-alert
    color="red"
    dismissible
    type="error"
    :value="estaActivado"
    @input="confirmarOperacion"
  >
    {{ mensaje }}
  </v-alert>
</template>

<script>
export default {
  name: "CartelError",
  props: ["mensaje", "estaActivado"],
  methods: {
    confirmarOperacion() {
      this.estaActivado = false;
      this.$emit("cerrar-cartel");
    },
  },
};
</script>
<template>
  <v-container v-if="estaActivado">
    <v-alert
      class="mb-0"
      dismissible
      border="left"
      colored-border
      type="error"
      color="red"
      transition="scale-transition"
      elevation="2"
      @input="confirmarOperacion"
    >
      {{ mensaje }}
    </v-alert>
  </v-container>
</template>

<script>
export default {
  name: "CartelErrorr",
  data: function () {
    return {
      estaActivado: false,
      mensaje: "",
    };
  },
  methods: {
    abrirCartel(mensaje) {
      this.estaActivado = true;
      this.mensaje = mensaje;
    },
    cerrarCartel() {
      this.estaActivado = false;
    },
    confirmarOperacion() {
      this.estaActivado = false;
      this.$emit("confirmar-operacion");
    },
  },
};
</script>
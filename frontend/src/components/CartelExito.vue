<template>
  <v-container v-if="estaActivado">
    <v-alert
      class="mb-0"
      dismissible
      border="left"
      colored-border
      color="green"
      transition="scale-transition"
      elevation="2"
      type="success"
      @input="confirmarOperacion"
    >
      {{ mensaje }}
    </v-alert>
  </v-container>
</template>

<script>
export default {
  name: "CartelExito",
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
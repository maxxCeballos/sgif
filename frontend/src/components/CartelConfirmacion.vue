<template >
  <div class="text-center">
    <v-dialog :value="estaActivado" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2 justify-center">
          {{ titulo }}
        </v-card-title>

        <v-card-text class="text-center mt-5">
          ¿Esta seguro que desea realizar esta accion?
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn text @click="cancelarOperacion"> Cancelar </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="confirmarOperacion"> Confirmar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Confirmacion",
  data: function () {
    return {
      titulo: "",
      estaActivado: false,
    };
  },
  methods: {
    abrirCartel(titulo) {
      this.titulo = titulo;
      this.estaActivado = true;
    },
    cerrarCartel() {
      this.estaActivado = false;
    },
    confirmarOperacion() {
      this.estaActivado = false;
      this.$emit("confirmar-operacion");
    },
    cancelarOperacion() {
      this.estaActivado = false;
      this.$emit("cancelar-operacion");
    },
  },
};
</script>


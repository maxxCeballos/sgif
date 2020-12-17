<template >
  <div class="text-center">
    <v-dialog :value="estaActivado" width="500">
      <v-card>  
        <v-card-title class="headline teal lighten-3 justify-center">
          
         {{titulo}}
        </v-card-title>

        <v-card-text class="text-center mt-5">
          {{contenido}}
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn  @click="confirmarOperacionInicio"> volver al Inicio </v-btn>
          <v-spacer></v-spacer>
          <v-btn  @click="confirmarOperacionMenu"> Volver Al Menu Principal </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "FinTransaccion",
  data: function () {
    return {
      titulo: "",
      estaActivado: false,
      contenido:""
    };
  },
  methods: {
    abrirCartel(titulo,contenido) {
      this.titulo = titulo;
      this.contenido=contenido;
      this.estaActivado = true;
    },
    cerrarCartel() {
      this.estaActivado = false;
    },
    confirmarOperacionInicio() {
      this.estaActivado = false;
      this.$emit("reiniciarTransaccion");
     
    },
    confirmarOperacionMenu() {
      this.estaActivado = false;
      this.$router.push({ path: "/" });
    },
    cancelarOperacion() {
      this.estaActivado = false;
      this.$emit("cancelar-operacion");
    },
  },
};
</script>


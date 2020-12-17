<template >
  <div class="text-center">
    <v-dialog :value="estaActivado" width="500">
      <v-card>  
        <v-card-title class="headline red justify-center">
          
         Ups
        </v-card-title>

        <v-card-text class="text-center mt-5">
          {{contenido}}
        </v-card-text>

        <v-divider />

        <v-card-actions class="justify-center">
          <v-btn  @click="cerrarCartel"> volver al Menu </v-btn>
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
      
      estaActivado: false,
      contenido:""
    };
  },
  methods: {
    abrirCartel(contenido) {
      this.contenido=contenido;
      this.estaActivado = true;
    },
    cerrarCartel() {
      this.estaActivado = false;
       this.$router.push({ path: "/" });
    },
    cancelarOperacion() {
      this.estaActivado = false;
     
    },
  },
};
</script>


<template >
  <div class="text-center">
    <v-dialog :value="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2 justify-center" >
         {{titulo}}
        </v-card-title>

        <v-card-text class="text-center mt-5" >
        Esta seguro que desea realizar esta accion?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn text @click="cancelar()">
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn   color="primary" @click="confirmar()">
            Confirmar
          </v-btn>
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
      titulo:"",
      contenido:"",
      dialog: false,
    };
  },
  methods: {
    abrirDialogo: function (titulo){
      this.titulo=titulo;
      this.dialog = true;
    },
    cerrarDialogo: function () {
      this.dialog = false;
    },
    cancelar: function () {
      this.dialog = false;
    },
     confirmar: function () {
       this.dialog = false;
        this.$emit('confirmada');
      
    }
  },
};
</script>


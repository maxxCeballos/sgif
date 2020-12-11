<template>
   <v-alert
      dismissible
      v-model="estaActivado"
      border="left"
      icon="mdi-check-circle-outline"
      colored-border
      color="green"
      max-width="500px"
      transition="scale-transition"

    >
      {{mensaje}}
    </v-alert>
</template>

<script>


export default {
  name: "CartelExito",
  data:function () {
    return {
      estaActivado:false,
      mensaje:"",
      
    };
  },
  methods: {
    confirmarOp(mensaje) {
        this.estaActivado = true;
        this.mensaje=mensaje
    },
  },
 
};
</script>
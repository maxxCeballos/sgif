<template>
  <v-container fluid class="grey lighten-5" style="padding-right: 0px;
padding-left:0px; padding-top: 0px;padding-bottom:0px ;overflow:hidden;" >
    <v-row no-gutters>
      <v-col >
      <Header />
      </v-col>
      
    </v-row>
  </v-container>
</template>


<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

import Header from "@/components/Header.vue";
//import TagregarDM from "@/components/transacciones/agregarDatosMesa/MesasSolicitadas.vue";

export default {
  name: "About",
  components: { Header},
};
</script>
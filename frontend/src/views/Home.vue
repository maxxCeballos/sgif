<template>
  <div class="home">
    <v-container>
      <v-card>
        <v-card-title primary-title> MENSAJE DE BIENVENIDA </v-card-title>
        <v-card-text> Hola, Bienvenido </v-card-text>
      </v-card>
    </v-container>
    
    <carta-citas-biblia />
  </div>
</template>

<script>
import CartaCitasBiblia from "../components/home/CartaCitasBiblia.vue";
export default {
  name: "Home",
  components: { CartaCitasBiblia },
};
</script>


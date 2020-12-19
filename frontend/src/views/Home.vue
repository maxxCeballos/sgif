<template>
  <div class="home">
    <v-container>
      <v-card>
        <v-card-title primary-title> BIENVENIDO </v-card-title>
        <v-card-text> Buen Día </v-card-text>
      </v-card>
    </v-container>

    <carta-clima />

    <carta-citas-biblia />
  </div>
</template>

<script>
import CartaCitasBiblia from "../components/home/CartaCitasBiblia.vue";
import CartaClima from "../components/home/CartaClima.vue";

export default {
  name: "Home",
  components: { CartaCitasBiblia, CartaClima },
};
</script>


<template>
  <div>
    <v-container class="contTit" @click="handleTitulo">
      <h1 class="text-center">SGIF</h1>
      <h4 class="text-center">Sistema Gestor Instituto Fatima</h4>
    </v-container>
    <!-- USUARIO -->
    <v-divider />
    <v-container>
      <v-list-item two-line>
        <v-list-item-avatar>
          <img alt="avatar" src="@/assets/avatar.png.jpg" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Michael Johnson</v-list-item-title>
          <v-list-item-subtitle>Secretario</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-container>
  </div>
</template>

<script>
export default {
  methods: {
    handleTitulo() {
      this.$router.push({ path: "/" });
    },
  },
};
</script>

<style>
.contTit {
  cursor: pointer;
}
</style>
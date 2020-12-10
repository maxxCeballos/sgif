<template>
  <!-- PALETA DE COLORES -->
  <!-- https://coolors.co/1c0f13-6e7e85-b7cece-bbbac6-e2e2e2 -->
  <!-- https://coolors.co/6c756b-93acb5-96c5f7-a9d3ff-f2f4ff -->

  <v-app>
    <v-navigation-drawer app>
      <SideNavBar />
    </v-navigation-drawer>

    <!-- Sizes your content based upon application components -->
    <!-- <v-main pd-5 class="cyan lighten-3"> -->
    <v-main pd-5 class="fondo">
      <!-- Provides the application the proper gutter -->
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SideNavBar from "@/components/SideNavBar.vue";

export default {
  name: "App",
  components: {
    SideNavBar,
  },
};
</script>

<style scoped>
.fondo {
  background: #E2E2E2;
}
.v-navigation-drawer {
  background: #A9D3FF;
}
</style>
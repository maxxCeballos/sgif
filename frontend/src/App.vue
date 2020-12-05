<template>
  <v-app>
  
      <SideNavBar />
    
    <!-- Sizes your content based upon application components -->
    <v-main pd-5 class="cyan lighten-3">
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

<style>
</style>
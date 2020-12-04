<template>
  <v-app>
    <div id="app">
      <SideNavBar />
      <v-container>         
        <router-view />
      </v-container>
    </div>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
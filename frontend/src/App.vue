<template>
  <!-- PALETA DE COLORES -->
  <!-- https://coolors.co/1c0f13-6e7e85-b7cece-bbbac6-e2e2e2 -->
  <!-- https://coolors.co/6c756b-93acb5-96c5f7-a9d3ff-f2f4ff -->

  <v-app>
    <!-- <v-navigation-drawer app> -->
      <!-- TODO para hacerlo mas responsive, capaz conviene q se transforme en barra superior al achicar -->
      <SideNavBar />
    <!-- </v-navigation-drawer> -->

    <!-- <v-navigation-drawer disable-resize-watcher permanent app>
      <template v-slot:prepend>
        <sidebar-titulo />
      </template>
      <v-divider />
      <sidebar-menu />
      <template v-slot:append> 
        <sidebar-bottom />
      </template>
    </v-navigation-drawer> -->

    <!-- Sizes your content based upon application components -->
    <v-main pd-5 class="fondo">
      <!-- Provides the application the proper gutter -->
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SideNavBar from "@/components/Sidebar/SideNavBar.vue";
// import SidebarTitulo from "./components/Sidebar/SidebarTitulo.vue";
// import SidebarMenu from "./components/Sidebar/SidebarMenu.vue";
// import SidebarBottom from "./components/Sidebar/SidebarBottom";

export default {
  name: "App",
  components: {
    SideNavBar,
    // SidebarTitulo,
    // SidebarMenu,
    // SidebarBottom,
  },
};
</script>

<style scoped>
.fondo {
  background: #e2e2e2;
}
.v-navigation-drawer {
  background: #a9d3ff;
}
</style>
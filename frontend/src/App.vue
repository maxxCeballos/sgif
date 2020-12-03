<template>
  <div id="app">
    <v-app>
      <v-toolbar app>
        <v-toolbar-title class="headline text-uppercase">
          <span>Vuetify</span>
          <span class="font-weight-light">MATERIAL DESIGN</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn text>
            <router-link to="/">Home</router-link>
          </v-btn>
          <v-btn text>
            <router-link to="/about">About</router-link>
          </v-btn>
          <v-btn text>
            <router-link to="/inscribir-mesa">
              Inscribir en Mesa de Examen
            </router-link>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-content>
        <router-view />
      </v-content>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    //
  }),
};
</script>
<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */
</style>

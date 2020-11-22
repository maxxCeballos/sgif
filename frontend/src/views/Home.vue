<template>
  <body>
    <div class="home">
      <Header />
      <div class="wrapper">
        <SideNavBar />
      <router-view/>  
      
      </div>
      
    </div>
    
  </body>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import SideNavBar from "@/components/SideNavBar.vue";
import Header from "@/components/Header.vue";
//import TagregarDM from "@/components/transacciones/agregarDatosMesa/MesasSolicitadas.vue";

export default {
  name: "Home",
  components: { Header, SideNavBar },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Josefin+Sans&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  list-style: none;
  text-decoration: none;
  font-family: "Josefin Sans", sans-serif;
}
.body {
  display: block;
}
.wrapper {
  display: flex;
  position: relative;
}
</style>
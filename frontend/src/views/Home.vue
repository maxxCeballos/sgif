<template>
  
    
    <div class="home">

        <SideNavBar />
    
      <router-view/>  
      
      </div>
      
  
    
 
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import SideNavBar from "@/components/SideNavBar.vue";

//import TagregarDM from "@/components/transacciones/agregarDatosMesa/MesasSolicitadas.vue";

export default {
  name: "Home",
  components: {  SideNavBar },
};
</script>

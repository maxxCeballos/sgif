<template>
  <div>
    <MesasSolicitadas
      ref="componentMesasSolicitadas"
      v-bind:estaPrendido="mostrandoSolicitadas"
      v-on:updateMesaElegida="updateMesa"
      v-on:error="activarCartelError"
    />

    <MesasCompartidas
      ref="componentMesasCompartidas"
      v-bind:estaPrendido="mostrandoCompartidas"
      :oidMesaElegida="oidMesaElegida"
      :materiaMesaElegida="materiaMesaElegida"
      :anioMateriaMesaElegida="anioMateriaMesaElegida"
      v-on:crearMesaI="crearMesaI"
      v-on:prenderCarga="procesar"
      v-on:terminarTransaccion="terminarTransaccion"
      v-on:volverInicio="reiniciarVista"
    />

    <MesaI
      ref="componentMesaIndividual"
      v-bind:estaPrendido="mostrandoIndividual"
      v-bind:oidMesaElegida="oidMesaElegida"
      v-bind:materiaMesaElegida="materiaMesaElegida"
      v-bind:anioMateriaMesaElegida="anioMateriaMesaElegida"
      v-on:prenderCarga="procesar"
      v-on:terminarTransaccion="terminarTransaccion"
      v-on:volverInicio="reiniciarVista"
    />
    <Loading ref="loadBar" />

    <Exito ref="alertE" />
    <Error ref="alertEr" />

    <CartelFinTransaccionExito
      ref="cartFinTransaccionExito"
      v-on:reiniciarTransaccion="reiniciarVista"
    />
    <CartelFinTransaccionError
      ref="componenteFinTransaccionError"
      
    />
    <!-- v-on:reiniciarTransaaccion="reiniciarTransaccion" -->
  </div>
</template>

<script>
import MesasSolicitadas from "../components/transacciones/agregarDatosMesa/MesasSolicitadas";
import MesasCompartidas from "../components/transacciones/agregarDatosMesa/MesasCompartidas";
import MesaI from "../components/transacciones/agregarDatosMesa/MesaIndividual";
import Exito from "@/components/CartelExito";
import Error from "@/components/CartelError";
import Loading from "@/components/Loading";
import CartelFinTransaccionExito from "@/components/CartelFinTransaccionExito";
import CartelFinTransaccionError from "@/components/CartelFinTransaccionError";

export default {
  name: "AgregarDatosMesa",
  props: [""],
  data() {
    return {
      mostrandoSolicitadas: true,
      mostrandoCompartidas: false,
      mostrandoIndividual: false,
      oidMesaElegida: "",
      materiaMesaElegida: "",
      anioMateriaMesaElegida: 0,
    };
  },
  components: {
    MesasSolicitadas,
    MesasCompartidas,
    MesaI,
    Exito,
    Error,
    Loading,
    CartelFinTransaccionExito,
     CartelFinTransaccionError
  },
  methods: {
    updateMesa(mesaSeleccionada) {
      this.oidMesaElegida = mesaSeleccionada.idMesa;
      this.materiaMesaElegida = mesaSeleccionada.materia;
      this.anioMateriaMesaElegida = mesaSeleccionada.anio;
      this.mostrandoSolicitadas = false;
      this.$refs.componentMesasCompartidas.obtenerInformacion();
      this.mostrandoCompartidas = true;
    },

    crearMesaI() {
      this.mostrandoCompartidas = false;
      this.mostrandoIndividual = true;
      this.$refs.componentMesaIndividual.obtenerInformacion();
    },

    procesar() {
      this.$refs.loadBar.activar();
      this.mostrandoCompartidas = false;
      this.mostrandoIndividual = false;
    },

    async terminarTransaccion(resultado) {
      await this.$refs.loadBar.desactivar();
      if (resultado.status) {
        this.$refs.cartFinTransaccionExito.abrirCartel(
          "Exito",
          resultado.message
        );
      } else {
        this.$refs.cartFinTransaccionExito.abrirCartel(
          "Ups",
          resultado.message
        );
      }
    },
    reiniciarDatos() {
      this.mostrandoSolicitadas = true;
      this.mostrandoCompartidas = false;
      this.mostrandoIndividual = false;
      this.oidMesaElegida = "";
      this.materiaMesaElegida = "";
      this.anioMateriaMesaElegida = 0;
    },
    reiniciarVista() {
      this.reiniciarDatos();
      this.$refs.componentMesasSolicitadas.reiniciarDatos();
      this.$refs.componentMesasCompartidas.reiniciarDatos();
      this.$refs.componentMesaIndividual.reiniciarDatos();
    },
    activarCartelError(error){
      this.$refs.componenteFinTransaccionError.abrirCartel(error);
    }
  },
  mounted() {
    this.$refs.componentMesasSolicitadas.obtenerInformacion();
  }
  
};
</script>
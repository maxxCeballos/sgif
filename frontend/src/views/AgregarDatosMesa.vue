<template>
  <div>
    <MesasSolicitadas
      v-bind:estaPrendido="mostrandoSolicitadas"
      v-on:updateMesaElegida="updateMesa"
    />

    <MesasCompartidas
      v-bind:estaPrendido="mostrandoCompartidas"
      :oidMesaElegida="oidMesaElegida"
      :materiaMesaElegida="materiaMesaElegida"
      :anioMateriaMesaElegida="anioMateriaMesaElegida"
      v-on:crearMesaI="crearMesaI"
      v-on:prenderCarga="procesar"
      v-on:terminarTransaccion="terminarTransaccion"
    />

    <MesaI
      ref="miMesaIndividual"
      v-bind:estaPrendido="mostrandoIndividual"
      v-bind:oidMesaElegida="oidMesaElegida"
      v-bind:materiaMesaElegida="materiaMesaElegida"
      v-bind:anioMateriaMesaElegida="anioMateriaMesaElegida"
    />
    <Loading ref="loadBar" />

    <!-- v-on:confirmar-operacion="confirmarExito" -->
    <Exito ref="alertE" />
    <Error ref="alertEr" />
  </div>
</template>

<script>
import MesasSolicitadas from "../components/transacciones/agregarDatosMesa/MesasSolicitadas";
import MesasCompartidas from "../components/transacciones/agregarDatosMesa/MesasCompartidas";
import MesaI from "../components/transacciones/agregarDatosMesa/MesaIndividual";
import Exito from "@/components/CartelExito";
import Error from "@/components/CartelError";
import Loading from "@/components/Loading";

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
  },
  methods: {
    updateMesa(mesaSeleccionada) {
      this.oidMesaElegida = mesaSeleccionada.idMesa;
      this.materiaMesaElegida = mesaSeleccionada.materia;
      this.anioMateriaMesaElegida = mesaSeleccionada.anio;
      this.mostrandoSolicitadas = false;
      this.mostrandoCompartidas = true;
    },

    crearMesaI() {
      this.mostrandoCompartidas = false;
      this.mostrandoIndividual = true;
      this.$refs.miMesaIndividual.obtenerInformacion();
    },

    procesar() {
      this.$refs.loadBar.activar();
      this.mostrandoCompartidas = false;
    },

    async terminarTransaccion(resultado) {
      await this.$refs.loadBar.desactivar();
      if (resultado.status) {
        this.$refs.alertE.abrirCartel(resultado.message);
      } else {
        this.$refs.alertEr.abrirCartel(resultado.message);
      }
    },
  },
};
</script>
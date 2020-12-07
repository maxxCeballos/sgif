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
    />

    <MesaI
    ref="miMesaIndividual"
      v-bind:estaPrendido="mostrandoIndividual"
      v-bind:oidMesaElegida="oidMesaElegida"
      v-bind:materiaMesaElegida="materiaMesaElegida"
      v-bind:anioMateriaMesaElegida="anioMateriaMesaElegida"
  
    />
  </div>
</template>

<script>
import MesasSolicitadas from "../components/transacciones/agregarDatosMesa/MesasSolicitadas";
import MesasCompartidas from "../components/transacciones/agregarDatosMesa/MesasCompartidas";
import MesaI from "../components/transacciones/agregarDatosMesa/MesaIndividual";

export default {
  name: "AgregarDatosMesa",
  props: [""],
  data() {
    return {
      picker: new Date().toISOString().substr(0, 10),

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
    MesaI
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
  },
};
</script>
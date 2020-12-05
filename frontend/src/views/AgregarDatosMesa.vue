<template>
  <div>
    <MesasSolicitadas v-bind:estaPrendido="mostrandoSolicitadas" />
    <MesasCompartidas
      v-bind:estaPrendido="mostrandoCompartidas"
      :oidMesaElegida="oidMesaElegida"
      :materiaMesaElegida="materiaMesaElegida"
      :anioMateriaMesaElegida="anioMateriaMesaElegida"
    />
  </div>
</template>

<script>
import MesasSolicitadas from "../components/transacciones/agregarDatosMesa/MesasSolicitadas";
import MesasCompartidas from "../components/transacciones/agregarDatosMesa/MesasCompartidas";

export default {
  name: "AgregarDatosMesa",
  props: [""],
  data() {
    return {
      mostrandoSolicitadas: false,
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
  },
  methods: {
    updateMesaElegida(mesaSeleccionada) {
      this.oidMesaElegida = mesaSeleccionada.idMesa;
      this.materiaMesaElegida = mesaSeleccionada.materia;
      this.anioMateriaMesaElegida = mesaSeleccionada.anio;
      this.mostrandoSolicitadas = false;
      this.mostrandoCompartidas = true;
    },
  },
};
</script>
<template>
  <div>
    <tabla-mesas-cerrar v-bind:mesas="mesas" v-on:select-mesa="selectMesa" />
  </div>
</template>

<script>
import TablaMesasCerrar from "../components/transacciones/cerrarMesa/TablaMesasCerrar.vue";

export default {
  name: "CerrarMesa",
  components: {
    TablaMesasCerrar,
  },
  data() {
    return {
      mesas: [],
      mesaSeleccionada: {},
    };
  },
  beforeMount: function () {
    this.mesas = [
      {
        acta: 1601,
        fechaHora: new Date(),
        nombreMateria: "Matematicas",
        anioMateria: 3,
        cicloLectivo: 2020,
        aula: 4,
      },
      {
        acta: 1602,
        fechaHora: new Date(),
        nombreMateria: "Lengua",
        anioMateria: 2,
        cicloLectivo: 2019,
        aula: 5,
      },
      {
        acta: 1603,
        fechaHora: new Date(),
        nombreMateria: "Biología",
        anioMateria: 2,
        cicloLectivo: 2019,
        aula: 2,
      },
    ];

    //TODO: consulta de axios

    let nuevasMesas = [];
    this.mesas.forEach((mesa) => {
      let dia = mesa.fechaHora.getDate();
      let mes = mesa.fechaHora.getMonth();
      let año = mesa.fechaHora.getFullYear();
      let hora = mesa.fechaHora.getHours();
      let minuto = mesa.fechaHora.getMinutes();
      let nuevaMesa = {
        ...mesa,
        fecha: `${dia}/${mes}/${año}`,
        hora: `${hora}:${minuto}`,
      };
      nuevasMesas.push(nuevaMesa);
    });
    this.mesas = nuevasMesas;
  },
  methods: {
    selectMesa(actaMesa) {
      this.mesaSeleccionada = this.mesas.find((mesa) => mesa.acta === actaMesa);
      console.log(this.mesaSeleccionada);
    },
  },
};
</script>
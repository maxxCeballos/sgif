

<template>
  <v-data-table :headers="headers" :items="mesas" :items-per-page="10" class="elevation-1">
    
  ></v-data-table>
</template>


<script>
//import {MDCDataTable} from '@material/data-table';
//const dataTable = new MDCDataTable(document.querySelector('.mdc-data-table'));

import axios from "axios";

export default {
  name: "TagregarDM",
  data: function () {
    return {
      headers: [
        { text: "Materia", value: "materia" },
        { text: "Año", value: "anio" },
        { text: "CicloLectivo", value: "cicloLectivo" },
      ],
      mesas: [{
        "materia":"Gg",
        "anio":2,
        "cicloLectivo": 2020
      }],
    };
  },
  methods: {
    gg: function (mensaje) {
      alert(mensaje);
    },
  },
  
  mounted() {
    axios
      .get("http://localhost:3000/agregarDatosMesaExamen/mesasSolicitadas")
      .then((res) => (this.mesas = res.data.mesasConDictados))
      .catch((error) => {
        if (!error.response) {
          // network error
          this.errorStatus = "Error: Network Error";
        } else {
          this.errorStatus = error.response.data.message;
        }
      });
  },
};
</script>

<style >
</style>
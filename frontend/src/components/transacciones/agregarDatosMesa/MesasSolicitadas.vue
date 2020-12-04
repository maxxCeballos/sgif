

<template>
  <v-data-table
    caption="Mesas Solicitadas"
    :headers="headers"
    :items="mesas"
    :items-per-page="10"
    item-key="mesaId"
    class="elevation-1"
    :loading="isLoading"
    loading-text="Cargando.. porfavor espere"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.materia }}</td>
        <td>{{ item.anio }}</td>
        <td>{{ item.cicloLectivo }}</td>
        <td>
          <router-link
            :to="{
              name: 'transaccionADMEC',
              params: {
                oidMesaElegida: item.mesaId,
                materiaMesaElegida: item.materia,
                anioMateriaMesaElegida: item.anio,
              },
            }"
          >
            <v-icon medium class="mr-2">
              mdi-arrow-right-circle-outline
            </v-icon>
          </router-link>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>


<script>
//import {MDCDataTable} from '@material/data-table';
//const dataTable = new MDCDataTable(document.querySelector('.mdc-data-table'));

import axios from "axios";
import { ipBackend } from "../../../config/backend.config";

export default {
  name: "TagregarDM",
  data: function () {
    return {
      headers: [
        { text: "Materia", value: "materia" },
        { text: "Año", value: "anio" },
        { text: "CicloLectivo", value: "cicloLectivo" },
        { text: "Seleccionar Mesa", value: "accion", sortable: false },
      ],
      mesas: [],
      isLoading: true,
    };
  },
  methods: {
    gg: function (mensaje) {
      alert(mensaje);
    },
  },

  mounted() {
    axios
      .get(`${ipBackend}/agregarDatosMesaExamen/mesasSolicitadas`)
      .then((res) => {
        console.log(res.data);
        this.mesas = res.data.mesasConDictados;
        this.isLoading = false;
      })
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
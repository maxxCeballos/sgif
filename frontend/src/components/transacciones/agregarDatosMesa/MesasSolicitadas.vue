<template>
  <div v-if="estaPrendido">
    <v-container>
      <v-card elevation="2" outlined>
        <v-card-title>Mesas de Examen Solicitadas</v-card-title>
        <v-card-subtitle
          >Seleccione una mesa para agregar datos</v-card-subtitle
        >
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="mesas"
            :items-per-page="10"
            item-key="mesaId"
            :loading="isLoading"
            loading-text="Cargando.. porfavor espere"
          >
            <template v-slot:item="{ item }">
              <tr
                v-on:click="
                  mesaSeleccionada(item.mesaId, item.materia, item.anio)
                "
              >
                <td>{{ item.materia }}</td>
                <td>{{ item.anio }}</td>
                <td>{{ item.cicloLectivo }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>


<script>
//import {MDCDataTable} from '@material/data-table';
//const dataTable = new MDCDataTable(document.querySelector('.mdc-data-table'));

import axios from "axios";
import { ipBackend } from "../../../config/backend.config";

export default {
  name: "TagregarDM",
  props: ["estaPrendido"],
  data: function () {
    return {
      headers: [
        { text: "Materia", value: "materia" },
        { text: "Año", value: "anio" },
        { text: "CicloLectivo", value: "cicloLectivo" },
      ],
      mesas: [],
      isLoading: true,
      resultadoTransaccion: "",
    };
  },
  methods: {
    gg: function (mensaje) {
      alert(mensaje);
    },
    mesaSeleccionada(idMesa, materia, anio) {
      this.$emit("updateMesaElegida", {
        idMesa: idMesa,
        materia: materia,
        anio: anio,
      });
    },
    obtenerInformacion() {
      axios
        .get(`${ipBackend}/agregarDatosMesaExamen/mesasSolicitadas`)
        .then((res) => {
          this.isLoading = false;
          if (res.data.mesasConDictados == undefined) {
            this.resultadoTransaccion = "No hay mesas solicitadas";
            this.$emit("error", this.resultadoTransaccion);
          } else {
            this.mesas = res.data.mesasConDictados;
          }
        });
    },
    reiniciarDatos() {
      this.resultadoTransaccion = "";
      this.obtenerInformacion();
    },
  },
};
</script>

<style >
</style>
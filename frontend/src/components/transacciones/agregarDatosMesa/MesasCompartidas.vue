

<template>
  <div v-if="estaPrendido">
    <v-data-table
      :headers="headers"
      :items="mesas"
      :items-per-page="10"
      item-key="mesaId"
      class="elevation-1"
      :loading="loading"
      loading-text="Cargando.. porfavor espere"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Mesas para Compartir</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="crearIndividual()" class="mb-2">
            Crear Mesa Individual
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr v-on:click="validar(item)">
          <td>{{ item.acta }}</td>
          <td>{{ item.fecha }}</td>
          <td>{{ item.hora }}</td>
          <td>{{ item.materia }}</td>
          <td>{{ item.anio }}</td>
          <td>{{ item.cicloLectivo }}</td>
        </tr>
      </template>
      ></v-data-table
    >
    <Confirmacion ref="miConfirmacion" v-on:confirmada="agregarDatosMesa" />
  </div>
</template>


<script>
//import {MDCDataTable} from '@material/data-table';
//const dataTable = new MDCDataTable(document.querySelector('.mdc-data-table'));

import axios from "axios";
import { ipBackend } from "../../../config/backend.config";
import Confirmacion from "@/components/CartelConfirmacion";

export default {
  name: "TagregarDMC",
  props: [
    "oidMesaElegida",
    "materiaMesaElegida",
    "anioMateriaMesaElegida",
    "estaPrendido",
  ],
  data: function () {
    return {
      headers: [
        { text: "N°Acta", value: "acta" },
        { text: "Fecha", value: "fecha" },
        { text: "Hora", value: "hora" },
        { text: "Materia", value: "materia" },
        { text: "Año", value: "anio" },
        { text: "CicloLectivo", value: "cicloLectivo" },
      ],
      mesas: [],
      loading: true,
      mesaSelect: "",
      datosAEnviar: {
        oidIndividual: "",
        padre: "",
        esPadre: "",
        materia: "",
        anio: "",
        profesores: "",
        preceptores: "",
        fechaHora: "",
        aula: "",
      },
      resultadoTransaccion: {
        message: "",
        status: false,
      },
    };
  },
  components: { Confirmacion },
  methods: {
    gg: function (mensaje) {
      alert(mensaje);
    },

    crearIndividual: function () {
      this.$emit("crearMesaI", {
        idMesa: this.oidMesaElegida,
        materia: this.materiaMesaElegida,
        anio: this.anioMateriaMesaElegida,
      });
    },
    validar: function (mesaCompartida) {
      this.$refs.miConfirmacion.abrirDialogo("Realizar Mesa Compartida");
      this.mesaSelec = mesaCompartida;
    },
    async agregarDatosMesa() {
      this.$emit("prenderCarga");
      this.datosAEnviar.oidIndividual = this.oidMesaElegida;
      this.datosAEnviar.padre = this.mesaSelec.idMesa;
      this.datosAEnviar.esPadre = this.mesaSelec.esPadre;
      this.datosAEnviar.materia = this.materiaMesaElegida;
      this.datosAEnviar.anio = this.anioMateriaMesaElegida;
      this.datosAEnviar.profesores = this.mesaSelec.profesores;
      this.datosAEnviar.preceptores = this.mesaSelec.preceptores;
      this.datosAEnviar.fechaHora = this.mesaSelec.fecha;
      this.datosAEnviar.aula = this.mesaSelec.aula;

      let resultado = await axios.put(
        `${ipBackend}/agregarDatosMesaExamen/registrarCompartida/`,
        this.datosAEnviar
      );

      if (resultado.data.respClient == undefined) {
        //Indica que no se pudo crear la mesa
        this.resultadoTransaccion.message =
          "No es posible completar la Mesa porque ningun profe puede de la mesa compartida puede impartir " +
          this.materiaMesaElegida +
          " de " +
          this.anioMateriaMesaElegida;
      } else {
        //se pudo crear la mesa
        this.resultadoTransaccion.message = resultado.data.respClient.message;
        this.resultadoTransaccion.status = true;
      }
      this.$emit("terminarTransaccion", this.resultadoTransaccion);
    },
  },
  mounted() {
    axios
      .get(`${ipBackend}/agregarDatosMesaExamen/mesasParaCompartir`)
      .then((res) => {
        console.log(res.data);
        this.mesas = res.data.mesasConDictados;
        this.loading = false;
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
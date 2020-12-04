<template>
  <div class="mdc-data-table" style="border: 1px solid black">
    <div class="mdc-data-table__table-container">
      <table
        class="mdc-data-table__table"
        aria-label="Dessert calories"
        style="border-collapse: collapse"
      >
        <caption>
          Seleccione la Mesa de Examen a Compartir
        </caption>
        <thead>
          <tr class="mdc-data-table__header-row">
            <th
              class="mdc-data-table__header-cell"
              role="columnheader"
              scope="col"
              style="padding: 50px"
            >
              NºActa
            </th>
            <th
              class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric"
              role="columnheader"
              scope="col"
              style="padding: 50px"
            >
              Fecha
            </th>
            <th
              class="mdc-data-table__header-cell"
              role="columnheader"
              scope="col"
              style="padding: 50px"
            >
              Hora
            </th>
            <th
              class="mdc-data-table__header-cell"
              role="columnheader"
              scope="col"
              style="padding: 50px"
            >
              Materia
            </th>
            <th
              class="mdc-data-table__header-cell"
              role="columnheader"
              scope="col"
              style="padding: 50px"
            >
              Año
            </th>
            <th
              class="mdc-data-table__header-cell"
              role="columnheader"
              scope="col"
              style="padding: 50px"
            >
              Ciclo Lectivo
            </th>
            <th
              class="mdc-data-table__header-cell"
              role="columnheader"
              scope="col"
              style="padding: 50px"
            >
              Aula
            </th>
          </tr>
        </thead>
        <tbody class="mdc-data-table__content">
          <tr
            data-row-id="u0"
            class="mdc-data-table__row"
            v-for="mesa in mesas"
            :key="mesa - id"
            v-on:click="gg(materiaMesaElegida+anioMateriaMesaElegida+oidMesaElegida)"
          >
            <td class="mdc-data-table__cell">{{ mesa.mesa.acta }}</td>
            <td class="mdc-data-table__cell">{{ mesa.mesa.fechaHora }}</td>
            <td class="mdc-data-table__cell">{{ mesa.mesa.fechaHora }}</td>
            <td class="mdc-data-table__cell">
              {{ mesa.dictado.materia.nombre }}
            </td>
            <td class="mdc-data-table__cell">
              {{ mesa.dictado.materia.anio }}
            </td>
            <td class="mdc-data-table__cell">
              {{ mesa.dictado.cicloLectivo }}
            </td>
            <td class="mdc-data-table__cell">{{ mesa.mesa.aula }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
//import {MDCDataTable} from '@material/data-table';
//const dataTable = new MDCDataTable(document.querySelector('.mdc-data-table'));

import axios from "axios";

export default {
  name: "TagregarDMC",
  props: {
    oidMesaElegida: { type: String, required: true },
    materiaMesaElegida: { type: String, required: true },
    anioMateriaMesaElegida: { type: String, required: true },
  },
  data: function () {
    return {
      mesas: [],
    };
  },
  methods: {
    gg: function (mensaje) {
      alert(mensaje);
    },
  },
  mounted() {
    axios
      .get("http://localhost:3000/agregarDatosMesaExamen/mesasParaCompartir")
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
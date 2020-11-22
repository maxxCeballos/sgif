<template>
  <div>
    <div class="mdc-data-table" style="border: 1px solid black">
      <div class="mdc-data-table__table-container">
        <table class="mdc-data-table__table" aria-label="Dessert calories">
          <caption>
            Seleccione una mesa solicitada
          </caption>
          <thead>
            <tr class="mdc-data-table__header-row">
              <th
                class="mdc-data-table__header-cell"
                role="columnheader"
                scope="col"
                style="padding: 50px"
              >
                Materia
              </th>
              <th
                class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric"
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
                CicloLectivo
              </th>
            </tr>
          </thead>
          <tbody class="mdc-data-table__content">
            <tr
              data-row-id="u0"
              class="mdc-data-table__row"
              v-for="mesa in mesas"
              :key="mesa - id"
              v-on:click="gg('el id es')"
            >
              <td class="mdc-data-table__cell">
                {{ mesa.dictado.materia.nombre }}
              </td>
              <td class="mdc-data-table__cell">
                {{ mesa.dictado.materia.anio }}
              </td>
              <td class="mdc-data-table__cell">
                {{ mesa.dictado.cicloLectivo }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <v-btn depressed> Normal </v-btn>
  </div>
</template>


<script>
//import {MDCDataTable} from '@material/data-table';
//const dataTable = new MDCDataTable(document.querySelector('.mdc-data-table'));

import axios from "axios";

export default {
  name: "TagregarDM",
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
@include checkbox.core-styles;
@include icon-button.core-styles;
@include data-table.core-styles;
@include data-table.theme-baseline;
</style>
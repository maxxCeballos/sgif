<template>
  <div>


    <div class="mdc-data-table" style="border: 1px solid black">
      <div class="mdc-data-table__table-container">
        <table
          class="mdc-data-table__table"
          aria-label="Dessert calories"
          style="border-collapse: collapse"
        >
          <caption>
            Seleccione una mesa solicitada
          </caption>
          <thead>
            <tr class="mdc-data-table__header-row">
              <th
                class="mdc-data-table__header-cell"
                role="columnheader"
                scope="col"
                style="padding: 25px"
              >
                Materia
              </th>
              <th
                class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric"
                role="columnheader"
                scope="col"
                style="padding: 25px"
              >
                Año
              </th>
              <th
                class="mdc-data-table__header-cell"
                role="columnheader"
                scope="col"
                style="padding: 25px"
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
              :key="mesa._id"
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
              <router-link
                :to="{
                  name: 'transaccionADMEC',
                  params: {
                    oidMesaElegida: mesa._id,
                    materiaMesaElegida: mesa.dictado.materia.nombre,
                    anioMateriaMesaElegida: mesa.dictado.materia.anio,
                  },
                }"
              >
                <v-icon>mdi-arrow-right-circle-outline </v-icon>
              </router-link>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
tr {
  border-top: 1px thin solid;
}
tbody :hover {
  background-color: beige;
}
</style>
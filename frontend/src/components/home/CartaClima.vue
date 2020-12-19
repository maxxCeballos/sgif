<template>
  <v-container>
    <v-card>
      <v-card-title primary-title> El Clima en la Zona </v-card-title>
      <v-card-text>
        <div v-if="isLoading">
          <v-progress-circular indeterminate color="primary" />
        </div>
        <div v-else>
          <div v-if="consultaExitosa">
            <v-row>
              <v-col
                v-for="pronostico in pronosticos"
                v-bind:key="pronostico.date"
              >
                <v-row>
                  <v-col>
                    <h2 class="font-weight-black">{{ pronostico.fecha }}</h2>
                    <h3>{{ pronostico.texto }}</h3>
                  </v-col>
                  <v-col>
                    <v-img
                      max-height="70"
                      max-width="70"
                      :src="pronostico.icono"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <h3 class="font-weight-black">Mínima</h3>
                    <h4 class="font-weight-regular">{{ pronostico.minTemp }} °C</h4>
                  </v-col>
                  <v-col>
                    <h3 class="font-weight-black">Máxima</h3>
                    <h4 class="font-weight-regular">{{ pronostico.maxTemp }} °C</h4>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <h3 class="font-weight-black">Probabilidad de Lluvia</h3>
                    <h4 class="font-weight-regular">{{ pronostico.chanceLluvia }} %</h4>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
          <h3 v-else>ERROR EN LA CONEXIÓN</h3>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import { apiClima } from '../../config/backend.config';

export default {
  name: "CartaClima",
  data() {
    return {
      consultaExitosa: true,
      isLoading: false,
      pronosticos: [],
    };
  },
  methods: {
    consultaClima() {
      this.isLoading = true;
      this.pronosticos = [];
      const options = {
        method: "GET",
        url: apiClima,
        params: { q: "Cipolletti", days: "3" },
        headers: {
          "x-rapidapi-key":
            "dd19a88c50msh2897ee489b20330p1d37aajsna49e7ee7a30f",
          "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
        },
      };

      axios
        .request(options)
        .then((response) => {
          response.data.forecast.forecastday.forEach((elem) => {
            let unPronostico = {
              texto: elem.day.condition.text,
              icono: elem.day.condition.icon,
              chanceLluvia: elem.day.daily_chance_of_rain,
              maxTemp: elem.day.maxtemp_c,
              minTemp: elem.day.mintemp_c,
              fecha: elem.date,
            };
            this.pronosticos.push(unPronostico);
          });
          this.consultaExitosa = true;
          this.isLoading = false;
        })
        .catch((error) => {
          console.error(error);
          this.consultaExitosa = false;
          this.isLoading = false;
        });
    },
  },
  created: function () {
    this.consultaClima();
  },
};
</script>
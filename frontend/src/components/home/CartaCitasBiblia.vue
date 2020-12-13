<template>
  <v-container>
    <v-card>
      <v-card-title primary-title> Versículo Aleatorio </v-card-title>
      <v-card-text>
        <div v-if="consultaExitosa">
          <h3 v-if="pasaje.Book">
            {{ pasaje.Book }} {{ pasaje.Chapter }}:{{ pasaje.Verse }}
          </h3>
          <h3 v-if="pasaje.Output">
            <i>"{{ pasaje.Output }}"</i>
          </h3>
        </div>
        <h3 v-else>ERROR EN LA API DE LA BIBLIA</h3>
      </v-card-text>
      <v-card-actions>
        <v-btn color="info" @click="consultaBiblia"> Buscar Siguiente </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "CartaCitasBiblia",
  data() {
    return {
      pasaje: {},
      consultaExitosa: true,
    };
  },
  methods: {
    consultaBiblia() {
      this.pasaje = {};
      axios
        .get("https://ajith-holy-bible.p.rapidapi.com/GetVerseOfaChapter", {
          params: {
            Verse: "1",
            Book: "Luke",
            chapter: "1",
          },
          headers: {
            "x-rapidapi-key":
              "dd19a88c50msh2897ee489b20330p1d37aajsna49e7ee7a30f",
            "x-rapidapi-host": "ajith-holy-bible.p.rapidapi.com",
            useQueryString: true,
          },
        })
        .then((res) => (this.pasaje = res.data))
        .catch(() => (this.consultaExitosa = false));
    },
  },
  created: function () {
    this.consultaBiblia();
  },
};
</script>